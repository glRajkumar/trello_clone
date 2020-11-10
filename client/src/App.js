import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { NotFound, Protected, UnAuthor, FirstCheck } from './Components/Common';
import { NavBar, Login, Signup } from './Components/User';
import { AllBoards, Board, CreateBoard, Detailed, PublicBoards, Shared } from "./Components/Boards"
import './CSS/app.css'

function App() {
  const { auth } = useSelector(state => state.auth)

  return (
    <div id="app">
      <NavBar auth={auth} />

      <Switch>
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        {
          auth
          && <Protected exact path="/" component={AllBoards} />
        }
        {
          !auth && <Route exact path="/" component={FirstCheck} />
        }

        <Protected exact path="/public" component={PublicBoards} />
        <Protected exact path="/shared" component={Shared} />
        <Protected exact path="/board/:boardid" component={Board} />
        <Protected exact path="/create-board" component={CreateBoard} />
        <Protected exact path="/taskdetails/:taskId" component={Detailed} />

        <Route exact path="/unauth" component={UnAuthor} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;