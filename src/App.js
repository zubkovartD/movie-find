import React from "react";
import Filters from "./Filters/Filters";
import MoviesList from "./Movies/MoviesList.jsx";
import Header from "./Header/Header";
import {API_URL,API_KEY_3,fetchAPI} from './Api/api';
import "./App.css";
import Cookies from 'universal-cookie';

const cookies = new Cookies()

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: null,
      session_id: null,
      filters: {
        sort_by: "vote_average.desc",
      },
      page: 1,
    };
  }

  updateUser = user => {
    this.setState({
      user
    })
  }

  updateSessionId = session_id => {
    cookies.set('session_id', session_id, {
      path: '/',
      maxAge: 2592000
    })
    this.setState({
      session_id
    })
  }

  onChangeFilters = (event) => {
    const newFilters = {
      ...this.state.filters,
      [event.target.name]: event.target.value,
    };
    this.setState({
      filters: newFilters,
    });
  };

  onChangePage = (page) => {
    this.setState({
      page,
    });
  };

  componentDidMount() {
    const session_id = cookies.get('session_id')
    console.log(session_id)
    if (session_id) {
      fetchAPI(`${API_URL}/account?api_key=${API_KEY_3}&session_id=${session_id}`)
      .then(user => {
        this.updateUser(user)
      })
    }
  }

  render() {
    const { filters, page, user } = this.state;
    return (
      <>
        <Header user={user} updateUser={this.updateUser} updateSessionId={this.updateSessionId} />
        <div className="container">
          <div className="row mt-4">
            <div className="col-4">
              <div className="card" style={{ width: "100%" }}>
                <div className="card-body">
                  <h3>Фильтры:</h3>
                  <Filters
                    filters={filters}
                    onChangeFilters={this.onChangeFilters}
                    page={page}
                    onChangePage={this.onChangePage}
                  />
                </div>
              </div>
            </div>
            <div className="col-8">
              <MoviesList
                filters={filters}
                page={page}
                onChangePage={this.onChangePage}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
