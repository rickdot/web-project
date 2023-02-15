

// show Main page
const showMain = async ({ render, state }) => {
  let data = {
    loginState:null
  }
    // before login
    const sessionInfo = (await state.session.context.state.sessionCache)
    if ("user" in sessionInfo) {
      data.loginState = true;
    } else {
      data.loginState = false;
    }

    render("main.eta", data);
  };

const showDescription = async ({render}) => {
    render("description.eta");
  };

export { showMain, showDescription };


