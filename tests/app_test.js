import { superoak } from "../deps.js";
import { assertStringIncludes } from "../deps.js";

import { app } from "../app.js";

// credentials will be used
const emailTest = "web123@aalto.fi";
const passwordTest = "1234";
// question will be added
const questionTitle = "MathQuestion1";
const questionText = "8-1=?";
let questionPath = null;
// option will be added
const optionText = "7";
const optionIsCorrect = true;
let deleteOptionPath = null;

// 1. request to /questions redirect to /auth/login, when not authenticated
Deno.test({
    name: "Access control: GET /questions without authentication, redirect to /auth/login",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/questions")
            .expect("Redirecting to /auth/login.")
            .expect(302);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// 2. register a user
Deno.test({
    name: "Registeration: POST /auth/register with credentials, redirect to /auth/login,",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/auth/register")
            .send(`email=${emailTest}&password=${passwordTest}`)
            .expect("Redirecting to /auth/login.")
            .expect(302);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// 3. login
Deno.test({
    name: "Login: POST /auth/login with credentials, redirect to /questions,",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/auth/login")
            .send(`email=${emailTest}&password=${passwordTest}`)
            .expect("Redirecting to /questions.")
            .expect(302);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// 4. login, POST to /questions, create a question
Deno.test({
    name: "Create a question: POST /questions with question content, redirect to /questions,",
    async fn() {
        // login
        let response = await superoak(app);
        let res = await response
            .post("/auth/login")
            .send(`email=${emailTest}&password=${passwordTest}`);
        const headers = res.headers["set-cookie"];
        const cookie = headers.split(";")[0];
        // create a question
        response = await superoak(app);
        res = await response
            .post("/questions")
            .set("Cookie", cookie)
            .send(`title=${questionTitle}&question_text=${questionText}`)
            .expect("Redirecting to /questions.")
            .expect(302);
        // verify the new question can be found on /questions
        response = await superoak(app);
        res = await response
            .get("/questions")
            .set("Cookie", cookie);
        assertStringIncludes(res.text, `${questionTitle}</a></td>`);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// 5. delete a question
Deno.test({
    name: "Delete a question: POST /questions/:id/delete, redirect to /questions,",
    async fn() {
        // login
        let response = await superoak(app);
        let res = await response
            .post("/auth/login")
            .send(`email=${emailTest}&password=${passwordTest}`);
        const headers = res.headers["set-cookie"];
        const cookie = headers.split(";")[0];
        // get the path of previous question
        response = await superoak(app);
        res = await response
            .get("/questions")
            .set("Cookie", cookie);
        let matchPart = `\">${questionTitle}`;
        const temp = res.text.split(matchPart)[0].split("href=\"");
        questionPath = temp[temp.length - 1];    
        // delete it   
        response = await superoak(app);
        await response
            .post(`${questionPath}/delete`)
            .set("Cookie", cookie)
            .expect(302)
            .expect("Redirecting to /questions.");
        // verify it's deleted
        response = await superoak(app);
        res = await response
            .get("/questions")
            .set("Cookie", cookie)
        assertStringIncludes(res.text, "No question yet.");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// 6. add a question, then add an correct option
Deno.test({
    name: "Add a correct answer option: POST /questions/:id with option content, redirect to /question/:id",
    async fn() {
        // login
        let response = await superoak(app);
        let res = await response
            .post("/auth/login")
            .send(`email=${emailTest}&password=${passwordTest}`)
        const headers = res.headers["set-cookie"];
        const cookie = headers.split(";")[0];
        // add a question first
        response = await superoak(app);
        await response
            .post("/questions")
            .set("Cookie", cookie)
            .send(`title=${questionTitle}&question_text=${questionText}`)
        // get the path of added question
        
        response = await superoak(app);
        res = await response
            .get("/questions")
            .set("Cookie", cookie);
        let matchPart = `\">${questionTitle}`;
        const temp = res.text.split(matchPart)[0].split("href=\"");
        questionPath = temp[temp.length - 1];
        // add an option, POST to /question/:id/options
        response = await superoak(app);
        await response
            .post(`${questionPath}/options`)
            .set("Cookie", cookie)
            .send(`option_text=${optionText}&is_correct=${optionIsCorrect}`)
            .expect(302)
            .expect(`Redirecting to ${questionPath}.`);
        // verify the option was added
        response = await superoak(app);
        res = await response
            .get(`${questionPath}`)
            .set("Cookie", cookie);
        assertStringIncludes(res.text, `<td>${optionText}</td>`);
    },
    
    sanitizeResources: false,
    sanitizeOps: false,
});


// 7. add an wrong option
const optionText2 = "789";
const optionIsCorrect2 = null;
Deno.test({
    name: "Add a wrong answer option: POST /questions/:id without 'is_correct', redirect to /question/:id",
    async fn() {
        // login
        let response = await superoak(app);
        let res = await response
            .post("/auth/login")
            .send(`email=${emailTest}&password=${passwordTest}`);
        const headers = res.headers["set-cookie"];
        const cookie = headers.split(";")[0];
        // add an wrong option, POST to /question/:id/options
        response = await superoak(app);
        await response
            .post(`${questionPath}/options`)
            .set("Cookie", cookie)
            .send(`option_text=${optionText2}`) // dont send is_correct
            .expect(302)
            .expect(`Redirecting to ${questionPath}.`);
        // verify the option was added
        response = await superoak(app);
        res = await response
            .get(`${questionPath}`)
            .set("Cookie", cookie);
        assertStringIncludes(res.text, `<td>${optionText2}</td>`);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});


// 8. delete an option
Deno.test({
    name: "Delete an answer option: POST /questions/:questionId/options/:optionId/delete, redirect to /questions",
    async fn() {
        // login
        let response = await superoak(app);
        let res = await response
            .post("/auth/login")
            .send(`email=${emailTest}&password=${passwordTest}`)
        const headers = res.headers["set-cookie"];
        const cookie = headers.split(";")[0];
        // find the delete option path
        response = await superoak(app);
        res = await response
            .get(questionPath)
            .set("Cookie", cookie);
        deleteOptionPath = res.text.split(`<td>${optionText2}</td>`)[1].split("action=\"")[1].split(" \">")[0];
        // delete the added wrong option, POST to /questions/:questionId/options/:optionId/delete
        response = await superoak(app);
        await response
            .post(deleteOptionPath)
            .set("Cookie", cookie)
            .expect(302)
            .expect(`Redirecting to ${questionPath}.`);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// 9. GET to /quiz, choose an answer, showing the result
Deno.test({
    name: "GET /quiz, get a random question, choose and view the results",
    async fn() {
        // login
        let response = await superoak(app);
        let res = await response
            .post("/auth/login")
            .send(`email=${emailTest}&password=${passwordTest}`);
        const headers = res.headers["set-cookie"];
        const cookie = headers.split(";")[0];
        // get the random question path /quiz/:id
        response = await superoak(app);
        res = await response
            .get("/quiz")
            .set("Cookie", cookie);
        const quizPath = res.header.location;
        // get the path for choosing the option
        response = await superoak(app);
        res = await response
            .get(quizPath)
            .set("Cookie", cookie);
        const optionPath = res.text.split("<input type=\"submit\" value=\"Choose\"/>")[0].split("action=\"")[1].split(" \">")[0]
        // choose the option, according to previous test, the answer should be correct
        response = await superoak(app);
        await response
            .post(optionPath)
            .set("Cookie", cookie)
            .expect(302)
            .expect(`Redirecting to ${quizPath}/correct.`); 
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

// 10. see statistics
Deno.test({
    name: "GET /statistics, view the Statistics page",
    async fn() {
        // login
        let response = await superoak(app);
        let res = await response
            .post("/auth/login")
            .send(`email=${emailTest}&password=${passwordTest}`);
        const headers = res.headers["set-cookie"];
        const cookie = headers.split(";")[0];
        // GET /statistics
        response = await superoak(app);
        res = await response
            .get("/statistics")
            .set("Cookie", cookie)
            .expect(200);
        // verify the page is Statistics page
        assertStringIncludes(res.text, "Statistics")
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
