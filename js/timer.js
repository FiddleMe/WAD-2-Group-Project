// input time(hrs, mins) specified by user
//updates element with id="timer" with a countdown timer


function displayTime(){
    display_countdown_timer(document.getElementById('hours').value, document.getElementById('minutes').value)
}

function endTime(){
    clearInterval(x);
    isDone = true
    document.getElementById("timer").innerHTML = "Start Again?";
    document.getElementById("progressBar").innerHTML = ''
    document.getElementById('input1').style.display = 'block'
    document.getElementById('input2').style.display = 'block'
}

function display_countdown_timer(hours,minutes){
    var time = (hours * 60 * 60 + minutes * 60) * 1000
    var initialTime = time
    // Update the count down every 1 second
    var original_time = time
    var isHalf =  false
    var isDone = false
    // const buttonAct = document.getElementById('save')

    if (document.getElementById('hours').value == '' && document.getElementById('minutes').value == ''){
        document.getElementById("timer").innerHTML = 'Enter your session duration to start'
        return
    }


    if (isNaN(document.getElementById('hours').value) || isNaN(document.getElementById('minutes').value)){
        document.getElementById("timer").innerHTML = 'Please enter a valid duration to start'
        return
    }

    document.getElementById('input1').style.display = 'none'
    document.getElementById('input2').style.display = 'none'
    // buttonAct.removeEventListener('click', displayTime)
    // buttonAct.addEventListener('click', endTime())


    

    var x = setInterval(function() {
        
        let progresswidth =  time / initialTime * 100
        // console.log(progresswidth)
        
        // Time calculations for hours, minutes and seconds
        var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((time % (1000 * 60)) / 1000);

        // Display the result in the element with id="timer"
        document.getElementById("timer").innerHTML = ''
        document.getElementById("timer").innerHTML = `Time left: ` + hours + "h " + minutes + "m " + seconds + "s ";


        // console.log(document.getElementById('progressBar').innerHTML)

        document.getElementById('progressBar').innerHTML = `<div class="progress">
        <div class="progress-bar" role="progressbar" style='width: ${progresswidth}%' aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
      </div>`



        // If the count down is finished, update the element with id="timer"
        if (time < 0) {
            clearInterval(x);
            isDone = true
            document.getElementById("timer").innerHTML = "Start Again?";
            document.getElementById("progressBar").innerHTML = ''
            document.getElementById('input1').style.display = 'block'
            document.getElementById('input2').style.display = 'block'
        }

        else{

        }
        
        if (time == original_time/2){
            isHalf = true
        }

        if (isHalf){
            alert("You're halfway there! Keep Going!")
            isHalf = false
        }

        if(isDone){
            alert("Congratulations! You have completed your session!")
            
        }

        time = time - 1000;
    }, 1000);
}