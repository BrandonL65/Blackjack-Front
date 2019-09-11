import React from 'react';
import Front from "./containers/Front"
import LoginPage from "./containers/LoginPage"
import "./css/Appcss.css"

class App extends React.Component{

  state = 
  {
    page: 'login',
    type: 'login'
  }

  redirect = (page) => 
  {
    this.setState({
      ...this.state,
      page: page 
    })
  }

  componentDidMount() 
  {
    if (localStorage.token) 
    {
      this.redirect('front')
    }
  }
  
  handleType = () => {
    if (this.state.type === 'login')
    {
      this.setState({
        ...this.state,
        type: 'signup'
      })
    }
    else if (this.state.type === 'signup')
    {
      this.setState({
        ...this.state,
        type: 'login'
      })
    }

  }
  render()
  {
    switch(this.state.page)
    {
      case 'login':
        return <LoginPage redirect = {this.redirect} type = {this.state.type} changeType = {this.handleType}/>

      case 'front':
        return <Front />

      default:
        return <LoginPage />

    }
  }

}

export default App;
