import * as statService from "../../services/statService.js";

const showStatPage = async ({render, state}) => {
    const user_id = (await state.session.get("user")).id;
    const statData = await statService.getStatDataByUserId(user_id);
    render("statistics.eta", statData)
}

const showUserAnswers = async ({render, state}) => {
    const user_id = (await state.session.get("user")).id;
    const statData = await statService.getStatDataByUserId(user_id);
    render("yourAnswers.eta", statData)
}

export {showStatPage, showUserAnswers}