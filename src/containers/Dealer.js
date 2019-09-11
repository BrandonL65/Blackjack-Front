import React from "react"

export default class Dealer extends React.Component 
{
    render() 
    {
        return (
            <div>
                <h1 onClick = {this.props.drawCardDealer}>New Dealer Card</h1>
                <h2 >All my cards </h2>
            </div>
        )
    }
}