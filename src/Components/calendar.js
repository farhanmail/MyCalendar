import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Collapse, Modal, Row } from 'react-bootstrap';


function Calendar () {
    const [openDialog, setOpenDialog]=useState(false); 
    const [open, setOpen] = useState(false);
    const [detailEvent, setDetailEvent] = useState();
    const [allEvent, setAllEvent] = useState([]);
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

    const [idCountry, setIdCountry] = useState([])
    const [holiday, setHoliday] = useState([])

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
        axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&limit=5&appid=709fa7c040f91716528ed153e06fe784`)
        .then((res)=>{
            axios.get(`https://date.nager.at/api/v3/publicholidays/${d.getFullYear()}/${res.data[0].country}`)
            .then((res, i)=>{
                i=res.data.length;
                res.data.forEach((o, key)  => {
                    res.data[key].title = o.localName
                });
                setHoliday(res.data);
                setAllEvent(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            setIdCountry(res.data);
            setCountry(res.data[0].country);
            setRegion(res.data[0].name);
            setState(res.data[0].state);
            console.log(res.data);
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
                                    <strong>ALL EVENT :</strong>
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
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Calendar;