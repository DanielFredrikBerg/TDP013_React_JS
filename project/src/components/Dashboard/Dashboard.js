import React, { useState, useEffect } from 'react';
import Login from '../Login/Login';

import {Dropdown, DropdownButton, Navbar, Container, Nav, NavDropdown, SplitButton, Button, NavbarBrand} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

async function logoutUser() {
    sessionStorage.clear();
    window.location.href="http://localhost:3000/"
}
async function createPost(postText) {
    console.log("asd")
}

async function DisplayPosts() {
    useEffect(() => {
        var a = document.getElementById('current_user_posts');
        var div = document.createElement("div");
        div.textContent = "asdf";
        a.appendChild(div)
      }, []); // <-- empty array means 'run once'
}

export default function Dashboard({userName}) {
    var currentUser = userName;
    var currentUserIsFriend = false;

    const [postText, setPostText] = useState();

    const handlePost = async e => {
        document.getElementById("create_post_form").reset();
        e.preventDefault();
        await createPost(postText).then(result => {
            console.log(result)
        });
    }

    var fName1 = "Friend 1"
    var fName2 = "This_is_a_long_fucking_friend_name"

    function createDropdownItem(friendName) {
        return (        
            <div style={{width : (friendName.length * 8 + 140).toString() + "px", margin : "10px"}}>
                <Navbar.Text style={{color : "black", marginLeft  : "10px"}}> <a style={{color : "black"}} href=''>{friendName}</a> 
                    <button style={{margin : "10px"}}>Add</button><button >Remove</button>
                </Navbar.Text>
            </div>
        )
    }
    

    return(
        <div className="dashboard_wrapper" >
            <div id="top">
                <Navbar variant="dark" id="Navbar" bg="dark" expand="lg" fixed="top">
                    <Container fluid>
                        <Navbar.Toggle aria-controls="navbar-dark" />
                        <Navbar.Collapse>
                        <DropdownButton
                                variant="dark"
                                title="Friends"
                                id="dropdown_button"
                                style={{display : "inline", float : "left"}}
                            > 
                            {createDropdownItem(fName1)}
                            {createDropdownItem(fName2)}
                            </DropdownButton>
                        </Navbar.Collapse>

                        <Navbar.Collapse id="navbar-dark" className="justify-content-center">
                            
                            <form>
                            <p><Navbar.Text style={{marginRight : "10px"}}>Find User</Navbar.Text></p>
                                <label>          
                                    <input type="text" name="username"  />
                                </label>
                                <Navbar.Text style={{marginLeft : "10px"}}><a href=''>Search</a></Navbar.Text>
                            </form>
                        </Navbar.Collapse>

                        <Navbar.Collapse className="justify-content-end" style={{marginRight : "10px"}}>
                            <Navbar.Text style={{marginTop : "25px"}}>
                                Signed in as: <a href="#login">{userName}</a>
                                <p><Navbar.Text varient="light" href="#home" onClick={logoutUser} style={{marginLeft: "20px"}}><a href=''>Sign Out</a></Navbar.Text></p>
                            </Navbar.Text>  
                        </Navbar.Collapse>

                    </Container>
                </Navbar> 
            </div>
            <div id="bot">

            </div>

        </div>
    )

      
}