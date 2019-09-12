import React from "react"
import "../css/RaiseBet.css"
import ChipRed from "../images/ChipRed.png"
import ChipBlack from "../images/ChipBlack.png"
export default class RaiseBet extends React.Component
{
    render() 
    {
        return(
            <div id = "middle">
                <div className = "fifty">
                    <img className = "fiftypic" src = {ChipRed}></img>
                    <p className = "fiftytext" >50</p>
                </div>
                <div className = "fifty">
                    <img className = "fiftypic" src = {ChipRed}></img>
                    <p className = "fiftytextminus" >-50</p>
                </div>
            </div>
        )
    }
}