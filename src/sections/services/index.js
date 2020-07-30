import React from 'react'
import {Row, Col, Container} from 'react-bootstrap'
import BaffleText from 'components/baffle-text'
import AnimationContainer from 'components/animation-container'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhp, faPython, faAws, faUnity} from '@fortawesome/free-brands-svg-icons'
import {
    faServer,
    faSmileBeam,
    faPizzaSlice,
    faCalendar,
    faCode,
    faDatabase
} from '@fortawesome/free-solid-svg-icons'
import Counter from 'components/counter'
import ThemeContext from '../../context'
import './styles.scss'

class Services extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
        }
        this.show = this.show.bind(this)
    }

    static contextType = ThemeContext

    show() {
        this.setState({show: true})
    }

    render() {
        return (
            <section
                id={`${this.props.id}`}
                className="services"
                style={{height: this.context.height}}
            >
                <Row
                    className="top"
                    style={{
                        maxHeight:
                            this.context.height !== 'auto'
                                ? this.context.height * 0.8
                                : 'inherit',
                    }}
                >
                    <div className="content">
                        <Col md={12}>
                            <div className="line-text">
                                <h4>Services</h4>
                            </div>
                            <div className="heading">
                                <BaffleText
                                    text="What I Do"
                                    revealDuration={500}
                                    revealDelay={500}
                                    parentMethod={this.show}
                                    callMethodTime={1100}
                                />
                            </div>
                            <div
                                className="services_container"
                                style={{
                                    minHeight:
                                        this.context.height !== 'auto'
                                            ? this.context.height * 0.6
                                            : 'inherit',
                                }}
                            >
                                <Container>{this.services()}</Container>
                            </div>
                        </Col>
                    </div>
                </Row>
                <Row className="bottom">{this.counters()}</Row>
            </section>
        )
    }

    services() {
        if (this.state.show || this.context.height === 'auto') {
            return (
                <Row>
                    <Col md={4} className="service">
                        <AnimationContainer delay={200} animation="fadeInLeft fast">
                            <div className="icon">
                                <FontAwesomeIcon icon={faPhp}/>
                            </div>
                            <h4>PHP</h4>
                            <p>
                                I have used Laravel for a little over 2 years, I have developed from backends for games
                                to dynamic sites and APIs. My knowledge has allowed me to create solutions that adapt to
                                the needs of the client, as well as to improve solutions already implemented.
                                <br/>
                                No Laravel? No problem, I can easily adapt to any PHP framework or just plain PHP.
                            </p>
                        </AnimationContainer>
                    </Col>
                    <Col md={4} className="service border-side">
                        <AnimationContainer delay={400} animation="fadeInDown fast">
                            <div className="icon">
                                <FontAwesomeIcon icon={faPython}/>
                            </div>
                            <h4>Python</h4>
                            <p>
                                Python is my favorite programming language, not only for its simplicity, but also for
                                its flexibility since I have used it from creating transactional systems, to IoT
                                integrations and Virtual Reality application backends.
                            </p>
                        </AnimationContainer>
                    </Col>
                    <Col md={4} className="service">
                        <AnimationContainer delay={600} animation="fadeInRight fast">
                            <div className="icon">
                                <FontAwesomeIcon icon={faUnity} className="solid"/>
                            </div>
                            <h4>Game Development</h4>
                            <p>
                                I have created several games (2D and 3D) and Virtual and Augmented Reality applications
                                for different platforms (PC, Android and Oculus Go) using Unity real-time 3D development
                                platform. I specialize in the programming, optimization and integration of all the
                                necessary components to successfully complete the projects.
                            </p>
                        </AnimationContainer>
                    </Col>
                    <Col md={4} className="service">
                        <AnimationContainer delay={800} animation="fadeInLeft fast">
                            <div className="icon">
                                <FontAwesomeIcon icon={faAws}/>
                            </div>
                            <h4>AWS Management</h4>
                            <p>
                                I have used AWS to deploy and about 60 web sites in EC2 instances, using CodePipeline,
                                implementing S3 , RDS and Cloudfront. Currently I'm learning more about AWS to be able
                                to deliver better results and solutions.
                            </p>
                        </AnimationContainer>
                    </Col>
                    <Col md={4} className="service border-side">
                        <AnimationContainer delay={1000} animation="fadeInUp fast">
                            <div className="icon">
                                <FontAwesomeIcon icon={faServer} className="solid"/>
                            </div>
                            <h4>Linux Server Management</h4>
                            <p>
                                I have a deep knowledge in handling linux servers, I feel comfortable using the terminal
                                to perform the necessary tasks to deploy applications, manage security and improve
                                server performance.
                            </p>
                        </AnimationContainer>
                    </Col>
                    <Col md={4} className="service">
                        <AnimationContainer delay={1200} animation="fadeInRight fast">
                            <div className="icon">
                                <FontAwesomeIcon icon={faDatabase} className="solid"/>
                            </div>
                            <h4>Database Management</h4>
                            <p>
                                I have the necessary knowledge to obtain and store information optimally from different
                                database management systems such as MySQL, Oracle, PostgeSQL, etc. I can also implement
                                basic security measures, optimization, backup and restore of databases.
                            </p>
                        </AnimationContainer>
                    </Col>
                </Row>
            )
        }
    }

    counters() {
        if (this.state.show || this.context.height === 'auto') {
            return (
                <Container>
                    <Col md={3}>
                        <AnimationContainer delay={100} animation="fadeIn fast">
                            <Counter
                                icon={faSmileBeam}
                                value={10}
                                text="Happy Clients"
                                symbol="+"
                                duration={3}
                            />
                        </AnimationContainer>
                    </Col>
                    <Col md={3}>
                        <AnimationContainer delay={100} animation="fadeIn fast">
                            <Counter
                                icon={faPizzaSlice}
                                value={1000}
                                text="Pizzas Ordered"
                                symbol="+"
                                duration={3}
                            />
                        </AnimationContainer>
                    </Col>
                    <Col md={3}>
                        <AnimationContainer delay={100} animation="fadeIn fast">
                            <Counter
                                icon={faCalendar}
                                value={7}
                                text="Years of Experience"
                                symbol="+"
                                duration={3}
                            />
                        </AnimationContainer>
                    </Col>
                    <Col md={3}>
                        <AnimationContainer delay={100} animation="fadeIn fast">
                            <Counter
                                icon={faCode}
                                value={50000}
                                text="Lines of Code"
                                symbol="+"
                                duration={3}
                            />
                        </AnimationContainer>
                    </Col>
                </Container>
            )
        }
    }
}

export default Services
