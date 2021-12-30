import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Collapse, Modal, Row, Button} from 'react-bootstrap';


function Calendar () {
    const [openDialog, setOpenDialog]=useState(false); 
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [detailEvent, setDetailEvent] = useState();
    const [allEvent, setAllEvent] = useState([]);
    const [holiday, setHoliday] = useState([]);
    const [idCountry, setIdCountry] = useState([]);
    const [country, setCountry] = useState();
    const [region, setRegion] = useState();
    const [state, setState] = useState();
    const handleDateClick = (event) => {
        setOpenDialog(true);
        setDetailEvent(event.dayEl.textContent)
    };

    const [location, setLocation] = useState({
        coordinates: { lat: "", lng: ""}
    });


    const onSuccess = (location) => {
        setLocation({
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            }
        })
        fetchData(location)
    };
    
    const onError = error => {
        setLocation({
            error,
        })
    };

    useEffect(() => {
        if( !("geolocation" in navigator) ){
            onError({
                code: 0,
                message: "Geolocation Error",
            })
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }, []);
    

    const fetchData = (location) => {
        const d = new Date();
        axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=1.352083&lon=103.819839&limit=5&appid=709fa7c040f91716528ed153e06fe784`)
        .then((res)=>{
            axios.get(`https://date.nager.at/api/v3/publicholidays/${d.getFullYear()}/${res.data[0].country}`)
            .then((res)=>{
                res.data.forEach((o, key)  => {
                    res.data[key].title = o.localName
                });
                res.data.forEach((o, key)  => {
                    res.data[key].display = 'background'
                });
                res.data.forEach((o, key)  => {
                    res.data[key].color = 'red'
                });
                setHoliday(res.data);
                setAllEvent(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            setIdCountry(res.data);
            setCountry(res.data[0].country);
            setRegion(res.data[0].name);
            setState(res.data[0].state);
            // console.log(res.data);
        })
        .catch((err) => {
            console.log(err)
        });
    }
    return (
        <>
            <div style={{paddingTop:'65px', paddingBottom:'10px'}}>
                <Modal
                    size="sm"
                    show={openDialog}
                    onHide={() => setOpenDialog(false)}
                    aria-labelledby="example-modal-sizes-title-lg"
                    centered
                >
                    <Modal.Header closeButton className='modal-event-bg'>
                        <Modal.Title className='modal-event'>Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='modal-body'>
                        <Row>
                        <Col sm='3'>
                            <div>
                                Event :
                            </div>
                        </Col>
                        <Col>
                            <li>
                                {detailEvent}
                            </li>
                        </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <Row>
                    <Col sm='3'>
                        <div className='left-event'>
                            <div id="typing">HAN <span>CALENDAR</span></div>
                            <p/>
                            <div id='text-location'>
                                <strong>- YOUR LOCATION -</strong>
                            </div>
                            <text><strong>Country :</strong></text>
                            <p>
                                <strong>{country}</strong>
                            </p>
                            <text><strong>Region :</strong></text>
                            <p>
                                <strong>{region}, {state}</strong>
                            </p>
                        </div>
                        <div className='left-event' style={{marginTop:'10px'}}>
                            <div>
                                <div id='text-location'>
                                    <strong><div>ALL EVENT :</div></strong>
                                    <h5 
                                        onClick={() => setOpen(!open)}
                                        id='underline'
                                    >
                                        See Events
                                    </h5>
                                    <Collapse in={open}>
                                        <div id="example-collapse-text">
                                            {allEvent.map((e) => {
                                                return (
                                                    <p style={{textAlign:'start', marginLeft:'10px'}}>- {e.localName}</p>
                                                )
                                            })}
                                        </div>
                                    </Collapse>
                                </div>
                            </div>
                        </div>
                        <div className='left-event' style={{marginTop:'10px'}}>
                            <div>
                                <div id='text-location'>
                                    <strong><div>CHANGE METODE</div></strong><div id='text-location'>
                                    <h5 
                                        onClick={() => setOpen2(!open2)}
                                        id='underline'
                                    >
                                        Change
                                    </h5>
                                    <Collapse in={open2}>
                                        <div id="example-collapse-text">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleFormControlSelect1">Select Country</label>
                                                    <select 
                                                        class="form-control" 
                                                        id="exampleFormControlSelect1"
                                                        value={country}
                                                        onChange={e => setIdCountry(e.currentTarget.country)}>
                                                        <option selected> Select ID </option>
                                                        <option value='ID'>ID</option>
                                                        <option value='SG'>SG</option>
                                                        <option value='LN'>LN</option>
                                                        <option value='JP'>JP</option>
                                                    </select>
                                                </div>
                                            </form>
                                            <Button as="input" type="submit" value="Submit" style={{marginTop:'10px'}} />{' '}
                                        </div>
                                    </Collapse>
                                </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className='calendar' style={{height: '90vh', padding:'20px', marginRight:'20px'}}>
                            <FullCalendar
                                plugins={[ dayGridPlugin, interactionPlugin ]}
                                dateClick={handleDateClick}
                                height='98%'
                                headerToolbar={{
                                    size: '10px',
                                    left: `prevYear,prev,next,nextYear`,
                                    center: `title`,
                                    right: `today,dayGridMonth,dayGridWeek,dayGridDay`
                                }}
                                events={holiday}
                                // eventColor='red'
                                eventBackgroundColor='blue'
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Calendar;