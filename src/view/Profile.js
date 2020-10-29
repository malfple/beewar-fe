import React from 'react'
import PropTypes from 'prop-types'

import * as api from '../api/api'

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      email: null
    }
  }

  componentDidMount() {
    this.fetchUserProfile()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.username !== prevProps.username) {
      this.fetchUserProfile()
    }
  }

  fetchUserProfile() {
    api.requestProfile(this.props.username).then(res => {
      console.log(res.data)
      if(res.data.user) {
        this.setState({
          username: res.data.user.username,
          email: res.data.user.email
        })
      }
    })
  }

  render() {
    return (
      <div>
        <div>
          Username: {this.state.username}
        </div>
        <div>
          Email: {this.state.email}
        </div>
      </div>
    )
  }
}

Profile.propTypes = {
  username: PropTypes.string.isRequired
}

export default Profile
