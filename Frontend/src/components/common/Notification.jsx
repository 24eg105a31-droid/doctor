import { Tabs, message } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Notification = () => {
   const [user, setUser] = useState()
   const navigate = useNavigate()
   const getUser = () => {
      const userdata = JSON.parse(localStorage.getItem('userData'))
      if (userdata) {
         setUser(userdata)
      }
   }


   const handleAllMarkRead = async () => {
      try {
         const res = await axios.post('http://localhost:2000/api/user/getallnotification', { userId: user._id }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            const updatedUser = { ...user, notification: [], seennotification: [...user.seennotification, ...user.notification] };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            
            message.success(res.data.message)
            setUser({ ...user, notification: [] })
         }
         else {
            message.error(res.data.message)
         }
      } catch (error) {
         console.log(error)
         message.error("something went wrong")
      }
   }
   const handledeleteAllMark = async () => {
      try {
         const res = await axios.post('http://localhost:2000/api/user/deleteallnotification', { userId: user._id }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            setUser({ ...user, seennotification: [] });
            message.success(res.data.message)
         }
         else {
            message.error(res.data.message)
         }
      } catch (error) {
         console.log(error)
         message.error("something went wrong")

      }
   }
   useEffect(() => {
      getUser()
   }, []);

   const tabItems = [
      {
         label: 'unRead',
         key: 'unRead',
         children: (
            <div>
               <div className="d-flex justify-content-end">
                  <h4 style={{ cursor: 'pointer' }} onClick={handleAllMarkRead} className="p-2">Mark all read</h4>
               </div>
               {user?.notification.map((notificationMsg, index) => (
                  <div key={index} onClick={notificationMsg.onClickPath} className="card">
                     <div className="card-text">
                        {notificationMsg.message}
                     </div>
                  </div>
               ))}
            </div>
         ),
      },
      {
         label: 'Read',
         key: 'Read',
         children: (
            <div>
               <div className="d-flex justify-content-end">
                  <h4 style={{ cursor: 'pointer' }} onClick={handledeleteAllMark} className="p-2">delete all read</h4>
               </div>
               {user?.seennotification.map((notificationMsg, index) => (
                  <div key={index} style={{ cursor: 'pointer' }} className="card" >
                     <div className="card-text" onClick={() => navigate(notificationMsg.onClickPath)}>
                        {notificationMsg.message}
                     </div>
                  </div>
               ))}
            </div>
         ),
      },
   ];

   return (
      <div>
         <h2 className='p-3 text-center'>Notification</h2>
         <Tabs items={tabItems} />
      </div>
   )
}

export default Notification
