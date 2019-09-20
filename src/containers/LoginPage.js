import React from "react"
import "../css/LoginPage.css"
import Logo from "../images/blackjackLogo.png"
export default class LoginPage extends React.Component 
{
    state = {
        name: "Name",
        password: "Password"
    }

    handleChange = (e) => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value,
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        fetch(`https://blackjack-back.herokuapp.com/${this.props.type}`,                                
        {
            method: 'POST',
            headers: 
            {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(this.state)                                //send the state form's contents to /login 
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.token) 
            {
                localStorage.token = data.token                     //If token exists, give it to localstorage 
                this.props.redirect('front')
            }
        })

    }

    render() 
    {
        if (this.props.type === 'login')
        {
            return (
                <div id = "bigDiv">
                    <img id = "logo" src = {Logo}></img>
                    <h1 className = "welcome" >Welcome to Blackjack!</h1>
                    <h2 className = "greeting">Log In</h2>
                    <form onSubmit = {this.handleSubmit}>
                        <label className = "labelInput" for = "name" >Name:</label>
                        <input className = "inputfields" type = "text" name = "name" value = {this.state.user} onChange = {this.handleChange} placeholder = "Name"></input>
                        <label className = "labelInput" for = "password" >Password:</label>
                        <input className = "inputfields" type = "password" name = "password" value = {this.state.password} onChange = {this.handleChange} placeholder = "Password"></input>
                        <input id = "submitInput"  type = "submit"></input>
                    </form>
                    <button className = "SignupLoginButton" onClick = {this.props.changeType}>Click here to sign up</button>
                </div>
            )
        }
        else if (this.props.type === 'signup')
        {
            return (
                <div id = "bigDiv">
                    <img id = "logo" src = {Logo}></img>
                    <h1 className = "welcome" >Welcome to Blackjack!</h1>
                    <h2 className = "greeting" >Sign up</h2>
                    <form onSubmit = {this.handleSubmit}>
                        <label className = "labelInput" for = "name" >Name:</label>
                        <input className = "inputfields" type = "text" name = "name" value = {this.state.name} onChange = {this.handleChange}></input>
                        <label className = "labelInput" for = "name" >Password:</label>
                        <input className = "inputfields" type = "password" name = "password" value = {this.state.password} onChange = {this.handleChange}></input>
                        <input id = "submitInput" type = "submit"></input>
                    </form>
                    <button className = "SignupLoginButton" onClick = {this.props.changeType}>Click here to Log in</button>
                </div>
            )
        }
    }
}