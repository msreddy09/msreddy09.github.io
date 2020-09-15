var ms_dev = {};
(context => { 
    context.companies_template_obj = mySkills.companies_template_obj;
    context.education_template_obj = mySkills.education;
    context.createCompanies = () => {
        $('body .companies_section').empty();  
        context.companies_template_obj.forEach(company => {
            context.companies_template = `
            <div class='col-sm-12 col-md-4'>
                <div class="card">
                    <img class ='logo' src=${company.logo}>
                    <div class="card-header">${company.c_name} <br><small style='color: gray; font-size: 70%'>${company.exp}</small> </div>
                    <div class="card-body">
                        <small>
                            <div class='card-text'> ${company.current_role}</div>
                            <div>${company.DOJ}</div>
                            <div>${company.location}</div>
                        </small>
                    </div>
                </div>
            </div>`;
            $('body .companies_section').append(context.companies_template);
        });
    }
    context.createSkills = () => {
        $('#skills #prof div').remove();
        $('#skills #interm div').remove();
        $('#skills #begginer div').remove();
        mySkills.skills.forEach(skill => {
            let skillTemplate;
            let progresStyle = 'bg-success';
            let elCont = ''
            let perInt = parseInt(skill.per)
            if(perInt >= 70) {
                progresStyle = 'bg-success';
                elCont = '#prof'
            }else if(perInt > 50 && perInt < 70) {
                progresStyle = 'bg-info';
                elCont = '#interm'
            }else{
                progresStyle = 'bg-warning';
                elCont = '#begginer'
            }
            skillTemplate =  `<div class="progress">
            <div class="progress-bar ${progresStyle}" role="progressbar" style="width: ${skill.per}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            <div style="
            line-height: 10;
            line-height: 15px;
            position: absolute;
            right: 5px; color: #ccc; font-weight: bold;"
            
            >${skill.per}</div>
            <div style="
            line-height: 10;
            line-height: 15px;
            position: absolute;
            left: 10px;">${skill.name}</div>
            </div>
            </div>`
            //$('#skills '+ elCont).empty();
            $('#skills '+ elCont).append(skillTemplate);
        })
    }

    context.createEducation = () => {
        $('body #edu .education_section').empty();
        context.education_template_obj.forEach(edu => {
            context.education_template = `
            <div class='col-sm-12 col-md-4'>
                <div class="card">
                    <div class="card-header">${edu.course} <br><small style='color: gray; font-size: 70%'><b>Grade: </b>${edu.per}</small> </div>
                    <div class="card-body">
                        <small>
                            <div class='card-text'> ${edu.institute}</div>
                            <div>${edu.year}</div>
                            <div>${edu.location}</div>
                        </small>
                    </div>
                </div>
            </div>`;
            $('body #edu .education_section').append(context.education_template);
        });

    }

    context.createContat = () => {
        $('#contact').empty();
        let contact_template = `<div class="media">
        <img width="64" style='margin-right: 15px;border-radius: 32px' src="https://media-exp1.licdn.com/dms/image/C5103AQGRGig68EGT1Q/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=AHsYfLVTb95e7IIfwB6iC0JdI2uLpdX9aBHx-ztdcXI" loading="lazy" height="64" alt="" id="ember799" class="d-none d-sm-none d-md-block feed-identity-module__member-photo profile-rail-card__member-photo EntityPhoto-circle-5 lazy-image ember-view">
        <div class="media-body">
          <h5 class="mt-0">Sudhakar Reddy Medagam</h5>
          <div><i class="fas fa-phone"></i> +91 9502030789</div>
          <div><i class="far fa-envelope"></i> <a href="mailto:msudhakarreddy09@gmail.com">msudhakarreddy09@gmail.com</a></div>
          <div><i class="fab fa-linkedin"></i> <a href="httdivs://www.linkedin.com/in/msreddy09/">https://www.linkedin.com/in/msreddy09</a> </div>
          <div><i class="fab fa-github"></i> <a href="httdivs://github.com/msreddy09">https://msreddy09.github.io/</a> </div>
          <br/>            
          <p><a class='btn btn-primary'
            href='https://docs.google.com/gview?url=https://raw.githubusercontent.com/msreddy09/msreddy09.github.io/master/sudhakar_Sr_Fullstack_JS_developer.docx'
            download>Download Resume</a> </p>
        </div>
      </div>`
      $('#contact').append(contact_template);
    }
    //context.createSkills();
    //context.createCompanies();
    //context.createEducation();
    let tabs = document.querySelectorAll('.nav-link');
    tabs.forEach((tab) => {
        tab.addEventListener('click', function(event){
            let tabName = (event.currentTarget.id);
            switch(tabName) {
                case 'skills-tab':  
                    context.createSkills();
                    break;
                case 'exp-tab':
                    context.createCompanies();
                    break;
                case 'port-tab':
                    context.createEducation()
                    break;
                case 'edu-tab':  
                    context.createEducation()
                    break;
                case 'contact-tab':  
                    context.createContat();
                    break;
                default :  break;
            }
        })
    })
   
})(ms_dev)

