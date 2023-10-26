import React from 'react';
import $ from 'jquery';
import moment from "moment";
import lists from './downlists.json'


const App = () => {
  const handleChange = (e) => {
    var checkbox = $(e.target);
    var Daylabel = $(checkbox).parent();
    var time1 = $(Daylabel).next();
    var time2 = $(time1).next();
    var diffInput = $(time2).next();
    if(e.target.checked){
      Daylabel.children().eq(1).text('Day Off')
      time1.hide()
      time2.hide()
      diffInput.hide()
    }else{
      Daylabel.children().eq(1).text('Day On')
      time1.show()
      time2.show()
      diffInput.show()
    }
  };
  const handleTimeChange = (e)=>{
    const target = $(e.target);
    if(target.attr('name') === 'time1'){
      const time2 = $(target).next()
      const diffInput = $(time2).next()
      var first = moment(target.val(),'HH:mm');
      var second = moment(time2.val(),'HH:mm')
      var diff = Math.floor(moment.duration(second.diff(first)).asHours())
      diffInput.val(diff)
    }else{
      const time1 = $(target).prev();
      const diffInput = $(target).next();
      first = moment(time1.val(),'HH:mm');
      second = moment(target.val(),'HH:mm')
      diff = Math.floor(moment.duration(second.diff(first)).asHours())
      diffInput.val(diff)
    }
  }
  const hanleSubmit = (e)=>{
    e.preventDefault()
    const form = document.getElementById('form');

    if (form) {

      const formData = new FormData(form);
      // console.log(formData,'33333');
      const fullName = formData.get('full_name');
      const phone = formData.get('phone');
      const personalId = formData.get('personal_id');
      const email = formData.get('email');
      const allInfo = {}
      allInfo.userInfo = {
        fullName,
        phone,
        personalId,
        email
      }
      const dateData = [];
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
        let dayStatus = formData.get(`check_${index}`)
        let date = formData.get(`date_${index}`)
        let time1 = formData.get(`time_${2*index}`)
        let time2 = formData.get(`time_${2*index+1}`)
        let diff = formData.get(`diff_${index}`)

        console.log(dayStatus,'dayStatus');
        if (dayStatus === null) {
          var obj = {
            date,
            time1,
            time2,
            diff
          }
          dateData.push(obj)
        }
      })
      allInfo.dateInfo = dateData;
      console.log(allInfo);
      $.ajax({
        url:"http://localhost:4000/send-email",
        type:'POST',
        dataType:'json',
        data:allInfo
      })

    }


  }
  return (
    <div>
      <form style={{margin:'auto',width:'600px',maxWidth:'600px'}} onSubmit={hanleSubmit} id='form' >
        <div>
          <input type='text' placeholder='full name' name='full_name' />
        </div>
        <div>
          <input type='text' placeholder='Phone' name='phone' />
        </div>
        <div>
          <input type='text' placeholder='Personal ID' name='personal_id' />
        </div>
        <div>
          <select name='email'>
            {
              lists.map((list,index)=>{
                return (
                  <option key={list.name} value={list.gmail}>{list.name}</option>
                )
              })
            }
          </select>
        </div>
        <div style={{padding:"20px",display:'flex'}}>
          <h3 style={{margin:"20px"}}>Dates</h3>
          <h3 style={{marginLeft:"200px"}}>Total Hours:<span id='total_hours'></span></h3>
        </div>
        {
          [1,2,3,4,5,6,7,8,9].map((value,index)=>{
            return (
              <div key={index} className={`dateGroup_${index}`}>
                <input type='date' name={`date_${index}`} />
                <label><input type='checkbox' onChange={handleChange} name={`check_${index}`} /><span>Day On</span></label>
                <input type='time' name={`time_${2*index}`} onChange={handleTimeChange} />
                <input type='time' name={`time_${2*index+1}`} onChange={handleTimeChange}/>
                <input type='number' name= {`diff_${index}`}/>
              </div>
            )
          })
        }
        <input type='submit' />
      </form>
    </div>
  )
  
};
export default App;

