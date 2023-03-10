import NavBar from './components/NavBar';
import styles from './App.module.css';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import PostCreateForm from './pages/posts/PostCreateForm';
import PostPage from './pages/posts/PostPage';
import Postspage from './pages/posts/Postspage';
import { useCurrentUser } from './contexts/CurrentUserContext';
import PostEditForm from './pages/posts/PostEditForm';
import ProfilePage from './pages/profiles/ProfilePage';
import UsernameForm from './pages/profiles/UsernameForm';
import UserPasswordForm from './pages/profiles/UserPasswordForm';
import ProfileEditForm from './pages/profiles/ProfileEditForm';
import PlantCreateForm from './pages/plants/PlantCreateForm';
import PlantPage from './pages/plants/PlantPage';
import PlantsPage from './pages/plants/PlantsPage';
import PlantEditForm from './pages/plants/PlantEditForm';
import NotFound from './components/NotFound';


function App() {
  // Determines who the user is
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/"
                render={() => (<Postspage message="No plants or profiles found by that name, please try another or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`} />
                )} />
              <Route exact path="/explore"
                render={() => (<Postspage message="No plants or profiles found by that name, please try another."
                />
                )} />
              <Route exact path="/bookmarks"
                render={() => (<Postspage message="No plants or profiles found by that name, please try another or save a post."
                filter={`bookmarks__owner__profile=${profile_id}&ordering=-bookmarks__created_at&`}
                />
                )} />
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route exact path="/posts/create" render={() => <PostCreateForm />} />
              <Route exact path="/posts/:id" render={() => <PostPage />} />
              <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
              <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
              <Route exact path="/profiles/:id/edit/username" render={() => <UsernameForm />} />
              <Route exact path="/profiles/:id/edit/password" render={() => <UserPasswordForm />} />
              <Route exact path="/profiles/:id/edit/" render={() => <ProfileEditForm />} />
              <Route exact path="/plants/create" render={() => <PlantCreateForm />} />
              <Route exact path="/plants/:id" render={() => <PlantPage />} />
              <Route exact path="/plants/" render={() => <PlantsPage />} />
              <Route exact path="/plants/:id/edit" render={() => <PlantEditForm />} />
              <Route render={() => <NotFound />} />
            </Switch>
          </Container>
        </div>
  );
}

export default App;