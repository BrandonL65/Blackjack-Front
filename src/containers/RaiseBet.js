import React from "react"
import "../css/RaiseBet.css"
import ChipRed from "../images/ChipRed.png"

export default class RaiseBet extends React.Component
{
    handleIncreaseClick = () => {
        this.props.handleBetAmount("increase");
    }
    handleDecreaseClick = () => 
    {
        this.props.handleBetAmount("decrease");
    }
    render() 
    {
        return(
            <div id = "middle">
                <div className = "fifty">
                    <img onClick = {this.handleIncreaseClick} className = "fiftypic" src = {ChipRed}></img>
                    <p className = "fiftytext" >50</p>
                </div>
                <div className = "fifty">
                    <img onClick = {this.handleDecreaseClick} className = "fiftypic" src = {ChipRed}></img>
                    <p className = "fiftytextminus" >-50</p>
                </div>
            </div>
        )
    }
}