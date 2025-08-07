
  $(function () {

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });

    // AOS ANIMATION
    AOS.init({
      disable: 'mobile',
      duration: 800,
      anchorPlacement: 'center-bottom'
    });


    // SMOOTHSCROLL NAVBAR
    $(function() {
      $('.navbar a, .hero-text a').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 49
        }, 1000);
        event.preventDefault();
      });
    });    
  });

  function openBlog1() {
    window.open('https://www.nerdfitness.com/blog/how-to-build-your-own-workout-routine/','_blank')
  }
  function openBlog2() {
    window.open('https://www.nerdfitness.com/blog/a-beginners-guide-to-the-gym-everything-you-need-to-know/','_blank')
  }
  function openBlog3() {
    window.open('https://www.nerdfitness.com/blog/7-strength-training-myths-every-woman-should-know/','_blank')
  }
  function openVegan() {
    window.open('vegan-diet-plan.html','_blank')
  }
  function openNonVegan() {
    window.open('non-vegan-diet-plan.html','_blank')
  }

  // Chatbot functionality
  function sendMessage() {
    const searchPrompt = document.getElementById('search-prompt');
    const message = searchPrompt.value.trim();
    
    if (!message) return;
    
    // Show the chatbot modal
    $('#gymGeniusModalchatbot').modal('show');
    
    // Add user message to modal
    const modalBody = document.querySelector('#gymGeniusModalchatbot .modal-body');
    modalBody.innerHTML = `
      <div class="chat-message user-message">
        <strong>You:</strong> ${message}
      </div>
      <div class="chat-message bot-message">
        <strong>GymGenius:</strong> <span id="bot-response">Thinking...</span>
      </div>
    `;
    
    // Send message to backend
    fetch('/api/chatbot/general', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('bot-response').textContent = data.data.message;
      } else {
        document.getElementById('bot-response').textContent = 'Sorry, I encountered an error. Please try again.';
      }
    })
    .catch(error => {
      document.getElementById('bot-response').textContent = 'Sorry, I\'m having trouble connecting. Please try again.';
    });
    
    // Clear input
    searchPrompt.value = '';
  }

  function sendCustomDietRequest() {
    const dietPrompt = document.getElementById('customDietPrompt');
    const message = dietPrompt.value.trim();
    
    if (!message) return;
    
    // Show response in modal
    const modalBody = document.querySelector('#customDietModal .modal-body');
    const responseDiv = document.createElement('div');
    responseDiv.className = 'diet-response mt-3';
    responseDiv.innerHTML = `
      <div class="alert alert-info">
        <strong>Your Request:</strong> ${message}
      </div>
      <div class="alert alert-success">
        <strong>GymGenius Response:</strong> <span id="diet-response">Processing...</span>
      </div>
    `;
    
    // Remove previous response if exists
    const existingResponse = modalBody.querySelector('.diet-response');
    if (existingResponse) {
      existingResponse.remove();
    }
    
    modalBody.appendChild(responseDiv);
    
    // Send to backend
    fetch('/api/chatbot/custom-diet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requirements: message })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('diet-response').innerHTML = data.data.dietPlan.replace(/\n/g, '<br>');
      } else {
        document.getElementById('diet-response').textContent = 'Sorry, I encountered an error. Please try again.';
      }
    })
    .catch(error => {
      document.getElementById('diet-response').textContent = 'Sorry, I\'m having trouble connecting. Please try again.';
    });
    
    // Clear input
    dietPrompt.value = '';
  }

  // Add event listeners for Enter key
  document.addEventListener('DOMContentLoaded', function() {
    const searchPrompt = document.getElementById('search-prompt');
    if (searchPrompt) {
      searchPrompt.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          sendMessage();
        }
      });
    }
    
    const dietPrompt = document.getElementById('customDietPrompt');
    if (dietPrompt) {
      dietPrompt.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          sendCustomDietRequest();
        }
      });
    }
  });
