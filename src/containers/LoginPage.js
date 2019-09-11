
import React from "react"


export default class LoginPage extends React.Component 
{
    state = {
        name: "",
        password: ""
    }

    handleChange = (e) => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value,
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/${this.props.type}`,                                
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
                <div>
                    <h1>Log In</h1>
                    <form onSubmit = {this.handleSubmit}>
                        <input type = "text" name = "name" value = {this.state.user} onChange = {this.handleChange}></input>
                        <input type = "password" name = "password" value = {this.state.password} onChange = {this.handleChange}></input>
                        <input type = "submit"></input>
                    </form>
                    <button onClick = {this.props.changeType}>Click here to sign up</button>
                </div>
            )
        }
        else if (this.props.type === 'signup')
        {
            return (
                <div>
                    <h1>Sign Up</h1>
                    <form onSubmit = {this.handleSubmit}>
                        <input type = "text" name = "name" value = {this.state.name} onChange = {this.handleChange}></input>
                        <input type = "password" name = "password" value = {this.state.password} onChange = {this.handleChange}></input>
                        <input type = "submit"></input>
                    </form>
                    <button onClick = {this.props.changeType}>Click here to Log in</button>
                </div>
            )
        }
    }
}