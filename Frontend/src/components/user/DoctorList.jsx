
import { message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';


const DoctorList = ({ userDoctorId, doctor, userdata }) => {

   const [dateTime, setDateTime] = useState('');
   const [documentFile, setDocumentFile] = useState(null);
   const [show, setShow] = useState(false);

   const currentDate = new Date().toISOString().slice(0, 16);

   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

   const handleChange = (event) => {
      setDateTime(event.target.value);
   };


   const handleDocumentChange = (event) => {
      setDocumentFile(event.target.files[0]);
   };

   console.log(doctor._id)
   const handleBook = async (e) => {
      e.preventDefault()
      
      // Validate required fields
      if (!dateTime) {
         message.error('Please select a date and time');
         return;
      }
      if (!userdata || !userdata._id) {
         message.error('User data is missing');
         return;
      }
      
      try {
         const formattedDateTime = dateTime.replace('T', ' ');
         const formData = new FormData();
         if (documentFile) {
            formData.append('image', documentFile);
         }
         formData.append('date', formattedDateTime);
         formData.append('userId', userdata._id);  // Use user's own ID, not doctor's userId
         formData.append('doctorId', doctor._id);
         formData.append('userInfo', JSON.stringify(userdata));
         formData.append('doctorInfo', JSON.stringify(doctor));

         console.log('Booking appointment:', { userId: userdata._id, doctorId: doctor._id, date: formattedDateTime });

         const res = await axios.post('http://localhost:2000/api/user/getappointment', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
               // Don't set Content-Type - axios will set it automatically with correct boundary
            },
         });
         
         if (res.data.success) {
            message.success(res.data.message)
            setDateTime('');
            setDocumentFile(null);
            setShow(false);
         }
         else {
            message.error(res.data.message || 'Booking failed')
         }
      } catch (error) {
         console.error('Booking error:', error)
         const errMsg = error?.response?.data?.message || error?.message || 'Something went wrong while booking';
         message.error(errMsg);
      }
   }
   return (
      <>
         <Card style={{ width: '18rem' }}>
            <Card.Body>
               <Card.Title>Dr. {doctor.fullName}</Card.Title>
               <Card.Text>
                  <p>Phone: <b>{doctor.phone}</b></p>
               </Card.Text>
               <Card.Text>
                  <p>Address: <b>{doctor.address}</b></p>
               </Card.Text>
               <Card.Text>
                  <p>Specialization: <b>{doctor.specialization}</b></p>
               </Card.Text>
               <Card.Text>
                  <p>Experience: <b>{doctor.experience} Yrs</b></p>
               </Card.Text>
               <Card.Text>
                  <p>Fees: <b>{doctor.fees}</b></p>
               </Card.Text>
               <Card.Text>
                  <p>Timing: <b>{doctor.timings[0]} : {doctor.timings[1]}</b></p>
               </Card.Text>
               <Button variant="primary" onClick={handleShow}>
                  Book Now
               </Button>
               <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                     <Modal.Title>Booking appointment</Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={handleBook}>
                     <Modal.Body>
                        <strong><u>Doctor Details:</u></strong>
                        <br />
                        Name:&nbsp;&nbsp;{doctor.fullName}
                        <hr />
                        Specialization:&nbsp;<b>{doctor.specialization}</b>
                        <hr />
                        <Row className='mb-3'>
                           <Col md={{ span: 8, offset: 2 }}>
                              <Form.Group controlId="formFileSm" className="mb-3">
                                 <Form.Label>Appointment Date and Time:</Form.Label>
                                 <Form.Control
                                    name='date'
                                    type="datetime-local"
                                    size="sm"
                                    min={currentDate} // Disable past dates
                                    value={dateTime}
                                    onChange={handleChange}
                                 />
                              </Form.Group>

                              <Form.Group controlId="formFileSm" className="mb-3">
                                 <Form.Label>Documents</Form.Label>
                                 <Form.Control accept="image/*" type="file" size="sm" onChange={handleDocumentChange} />
                              </Form.Group>

                           </Col>
                        </Row>
                     </Modal.Body>
                     <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                           Close
                        </Button>
                        <Button type='submit' variant="primary">
                           Book
                        </Button>
                     </Modal.Footer>
                  </Form>
               </Modal>
            </Card.Body>
         </Card>
      </>
   )
}

export default DoctorList
