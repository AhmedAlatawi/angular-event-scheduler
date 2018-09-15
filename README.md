## MEAN app running on OpenShift V3
-----------------

App using the full MEAN stack: MongoDB, Express.JS, AngularJS, and Node.JS.
It also shows how to write clean, testable and maintainable code.

### [Live Demo](http://nodejs-mongo-persistent-event-scheduler.a3c1.starter-us-west-1.openshiftapps.com/)

### Front-end Technologies
- [AngularJS](https://angularjs.org/)
- [Angular-Route](https://docs.angularjs.org/api/ngRoute/service/$route)
- [Angular-Bootstrap](https://docs.angularjs.org/api/ng/function/angular.bootstrap)
- [Angular-UI-Calendar](http://angular-ui.github.io/ui-calendar/)
- [Angular-Animate](https://docs.angularjs.org/api/ngAnimate)
- [Angular-Messages](https://docs.angularjs.org/api/ngMessages/directive/ngMessages)
- [Angularjs-Datepicker](https://github.com/720kb/angular-datepicker)
- [AngularJS-Toaster](https://github.com/jirikavi/AngularJS-Toaster)
- [Angular-Bootstrap-Colorpicker](https://github.com/buberdds/angular-bootstrap-colorpicker)
- [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
- [UI Bootstrap](https://angular-ui.github.io/bootstrap/)
- [Lodash](https://lodash.com/)
- [Font-Awesome](https://fontawesome.com/)

### Back-end Technologies

- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)
- [Mongodb](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

### App Overview

	angular-event-scheduler
	├── app
	│   └── models
	│       └── event.js
	|   └── routes
	|       └── event.js
	|   └── common-routes.js
	├── config
	|   └── env
	|       └── local.js
	|       └── openshift3.js
	├── public
	|   └── css
	|       └── fullcalendar.css
	|       └── style.css
	|   └── form
	|       └── form-submit-validator.js
	|   └── img
	|       └── images
	|   └── js
	|       └── app-routes.js
	|       └── app-controller.js
	|       └── app-module.js
	|   └── libs
	|   └── modules
	|       └── event
	|           └── calendar
	|               └── event-calendar.controller.js
	|               └── event-calendar.html
	|               └── event-calendar.js
	|           └── edit
	|               └── event-edit.controller.js
	|               └── event-edit.html
	|               └── event-edit.js
	|           └── search
	|               └── event-search.controller.js
	|               └── event-search.html
	|               └── event-search.js
	|           └── event.controller.js
	|           └── event.module.js
	|           └── event.service.js
	|    └── pagination
	|        └── pagination.service.js
	|    └── spinner
	|        └── spinner.js
	|    └── timepicker
	|        └── timepicker.controller.js
	|        └── timepicker.html
	|        └── timepicker.js
	|    └── views
	|        └── edit-events.html
	|        └── home.html
	|        └── search-events.html
	|    └── index.html
	├── package.json
	├── package-lock.json
	├── README.md
	├── tests
	│   └── app_test.js
	└── server.js


### Run app locally

Before you start, make sure you have npm, node and mongoDB (running on port 27017) installed on you machine.
Copy or download the app:

        cd angular-event-scheduler
        npm install
        npm run local

App should be up and running on:

        http://localhost:8080/


### Run app on OpenshiftV3

Please follow these [steps](https://docs.openshift.com/online/getting_started/basic_walkthrough.html)
Also, make sure you use this repository instead of openshift/nodejs-ex

### Report Bugs

Please report any bugs [here](https://github.com/AhmedAlatawi/angular-event-scheduler/issues).

### Contributions

Please shoot me an email if you'd like to contribute in anyways.

### Compatibility

This repository is compatible with Node.js 8.11.1, NPM 6.1.0, and MongoDB 3.6.

### What's next?

You're probably thinking why not add another module, let's say User module, so that you can allow customers to have their own accounts. This would be a good start to extent the app to do more stuff. 

### License
[MIT License](https://github.com/AhmedAlatawi/angular-event-scheduler/blob/master/LICENSE).