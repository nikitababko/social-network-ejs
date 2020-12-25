import React, { Fragment, Suspense, lazy } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { history } from "./_helpers/history";
// TODO:
import "./styles/index.css";

const NotFoundPage = lazy(() => import("./NotFoundPage/NotFoundPage"));
const PasswordResetPage = lazy(() => import("./PasswordResetPage/PasswordResetPage"));
const HomePage = lazy(() => import("./HomePage/HomePage"));
// TODO:

class App extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        window.addEventListener("scroll", this.handleNotificationPopupClose);
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    handleNotificationPopupClose = () => {
        const { dispatch, isOpen } = this.props;
        if (isOpen) {
            dispatch(notificationActions.closeNotificationPopup());
        }
    };

    render() {
        const { authentication } = this.props;

        return (
            <div onClick={this.handleNotificationPopupClose}>
                <Router history={history}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Fragment>
                            {authentication.loggedIn ? <Navbar /> : null}
                            <Switch>
                                <PrivateRoute exact path="/" component={HomePage} />
                                <Route exact path="/login" render={() => <LoginPage />} />
                                <Route
                                    exact
                                    path="/register"
                                    render={() => <RegisterPage />}
                                />
                                <PrivateRoute
                                    exact
                                    path="/profile"
                                    component={ProfilePage}
                                />
                                <PrivateRoute
                                    exact
                                    path="/posts/upload"
                                    component={PostUploadPage}
                                />
                                <PrivateRoute
                                    exact
                                    path="/messages/chat"
                                    component={MessengerPage}
                                />
                                <Route
                                    path="/hashtags/:hashtag"
                                    render={(props) => {
                                        if (!localStorage.getItem("user")) {
                                            history.push("/login");
                                            window.location.reload();
                                        }
                                        return (
                                            <HashtagPage
                                                key={props.match.params.hashtag}
                                                {...props}
                                            />
                                        );
                                    }}
                                />
                                <Route
                                    path="/p/:postId"
                                    render={(props) => {
                                        if (!localStorage.getItem("user")) {
                                            history.push("/login");
                                            window.location.reload();
                                        }
                                        return (
                                            <PostPage
                                                key={props.match.params.postId}
                                                {...props}
                                            />
                                        );
                                    }}
                                />
                                <Route
                                    path="/location/:coordinates"
                                    render={(props) => {
                                        if (!localStorage.getItem("user")) {
                                            history.push("/login");
                                            window.location.reload();
                                        }
                                        return (
                                            <LocationPage
                                                key={props.match.params.coordinates}
                                                {...props}
                                            />
                                        );
                                    }}
                                />
                                <Route
                                    exact
                                    path="/:username"
                                    render={(props) => {
                                        if (!localStorage.getItem("user")) {
                                            history.push("/login");
                                            window.location.reload();
                                        }
                                        return (
                                            <UserProfile
                                                key={props.match.params.username}
                                                {...props}
                                            />
                                        );
                                    }}
                                />

                                <Route
                                    exact
                                    path="/auth/reset/password/:jwt"
                                    render={(props) => <PasswordResetPage {...props} />}
                                />
                                <Route render={() => <NotFoundPage />} />
                            </Switch>
                        </Fragment>
                    </Suspense>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authentication: state.authentication,
    isOpen: state.notification.isOpen,
});

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };
