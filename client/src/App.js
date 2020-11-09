import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { NotFound, Protected, UnAuthor, FirstCheck } from './Components/Common';
import { NavBar, Login, Signup } from './Components/User';
import './CSS/app.css'
import AllBoards from './Components/Boards/AllBoards';
import CreateBoard from './Components/Boards/CreateBoard';
import Board from './Components/Boards/Board';
import Detailed from './Components/Boards/Detailed';

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