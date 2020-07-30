import React from 'react'
import Particles from 'react-particles-js';
import Progress from 'components/progress'
import {Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGithub, faLinkedin, faInstagram} from '@fortawesome/free-brands-svg-icons'
import ThemeContext from '../../context'
import './styles.scss'


class Hero extends React.Component {

    static contextType = ThemeContext

    render() {
        return (
            <section id={`${this.props.id}`} className="about" style={{height: this.context.height}}>
                {this.particles()}
                <Row>
                    <Col md={6} className="content">
                        <div className="content-text">
                            <div className="line-text">
                                <h4>About Me</h4>
                            </div>
                            <h3>I'm a Developer working from home</h3>
                            <div className="separator"/>
                            <p>Hello! My name is Carlos Cativo, I am a Backend and Videogame Developer with passion for
                                what I do and retrofuturist stuff (<span role="img" aria-label="emoji">&#128540;</span>). I am dedicated to my work with an exquisite work
                                ethic, I always finds a way to overcome any challenge given. I am also a perfectionist
                                and I try to produce the highest quality of work to be presented. I adapt and learn
                                quickly, which allows me to work in any environment, with any technology, I try to
                                always be learning to improve so I can always give the best solution. It would be a
                                pleasure to work with you on any project. <span role="img" aria-label="alien">&#128125;</span></p>
                            <div className="social social_icons">
                                <FontAwesomeIcon icon={faGithub} className="social_icon"
                                                 onClick={() => window.open('https://www.github.com/cativo23')}/>
                                <FontAwesomeIcon icon={faInstagram} className="social_icon"
                                                 onClick={() => window.open('https://www.instagram.com/ccativo23/')}/>
                                <FontAwesomeIcon icon={faLinkedin} className="social_icon"
                                                 onClick={() => window.open('https://www.linkedin.com/in/carlos-cativo/')}/>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} className="skills">
                        <div className="line-text">
                            <h4>My Skills</h4>
                        </div>
                        <div className="skills-container">
                            <Progress name="PHP" value={90} delay={1100}/>
                            <Progress name="Python" value={90} delay={1100}/>
                            <Progress name="C#" value={80} delay={1100}/>
                            <Progress name="AWS" value={50} delay={1100}/>
                            <Progress name="MySQL/MariaDB" value={90} delay={1100}/>
                            <Progress name="Unity" value={85} delay={1100}/>
                            <Progress name="Nice Guy" value={110} delay={1100}/>
                        </div>
                    </Col>
                </Row>
            </section>
        )
    }

    particles() {
        return (
            <Particles
                className="particles"
                params={{
                    "particles": {
                        "number": {
                            "value": 50,
                            "density": {
                                "enable": false,
                                "value_area": 5000
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "opacity": .5
                        },
                        "size": {
                            "value": 1
                        },
                    },
                    "retina_detect": true
                }}/>
        )
    }

}

export default Hero