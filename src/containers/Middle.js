import React from "react"
import "../css/Middlecss.css"
import RaiseBet from "./RaiseBet.js"
export default class Middle extends React.Component
{

    render()
    {
        return (
            <div className = "middle">
                <h2>{this.props.winOrLose}</h2>
                <div className = "middleSeparate">
                    <h3>Chips: {this.props.chips}</h3>
                    <RaiseBet />
                    <h3>Current Bet: {this.props.betAmount} </h3>
                </div>

                <div className = "middleSeparate">
                {this.props.displayDealerTotal === true ? (<h3>Dealer Total: {this.props.dealerTotal}</h3>) : null}
                    <button id = "new"onClick = {this.props.newGame}>New</button>
                    <button id = "hit" onClick = {this.props.drawOne}>Hit</button>
                    <button id = "stand" onClick = {this.props.stand}>Stand</button>
                    <h3>Total: {this.props.playerTotal}</h3>     
                </div>

            </div>
        )
    }
}