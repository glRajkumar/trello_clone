import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { NotFound, Protected, UnAuthor, FirstCheck } from './Components/Common';
import { NavBar, Login, Signup } from './Components/User';
import { AllBoards, Board, CreateBoard, Detailed, LiveBoard } from "./Components/Boards"
import { PublicBoards, AllSharedBoards, SharedBoard, SharedDetails } from './Components/OBoards'
import { CreateLive, Join } from "./Components/Socket"
import './CSS/app.css'

function App() {
  const { auth } = useSelector(state => state.auth)

  return (
    <div id="app">
      <NavBar />

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
        <Protected exact path="/allsharedboards" component={AllSharedBoards} />
        <Protected exact path="/board/:boardId" component={Board} />
        <Protected exact path="/sharedboard/:boardId" component={SharedBoard} />
        <Protected exact path="/create-board" component={CreateBoard} />
        <Protected exact path="/taskdetails/:taskId" component={Detailed} />
        <Protected exact path="/sharedtask/:taskId" component={SharedDetails} />

        <Protected exact path="/join-live" component={Join} />
        <Protected exact path="/create-live" component={CreateLive} />
        <Protected exact path="/live/:room" component={LiveBoard} />

        <Route exact path="/unauth" component={UnAuthor} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;