# HRQ_Server

**Login Admin**
----
  Returns json data about Admin.

* **URL**

  /admin/login

* **Method:**

  `POST`
  
*  **URL Params**
 
   `NONE`

* **Data Params**
    ```
    {
        email: [string],
        password: [string]
    }
    ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    { 
        "token" : [string],
        "payload" : {
            "id": [Integer],
            "email": [string],
            "authLevel": [integer]
        }
    }
    ```
 
* **Error Response:**

  * **Code:** 401 DATA NOT FOUND <br />
    **Content:**
    ```
    { 
       "message" : "Email/Password invalid"
    }
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```

 ------

**Add Employee**
----
  Returns json data about new employee.

* **URL**

  /admin/employee

* **Method:**

  `POST`
  
*  **URL Params**
 
   `NONE`

* **Headers Params**
    ```
    {
        token: [string]
    }
    ```

* **Data Params**
    ```
    {
        name: [string],
        password: [string],
        email:  [string],
        birthDate:  [integer],
        address:  [string],
        phoneNumber:  [string],
        role: [string],
        authLevel:  [integer],
        superior: [integer],
        authLevel:  [integer],
        createdAt:  [date],
        updatedAt: [date]
    }
    ```
* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
    ```
    { 
        id: [integer],
        name : [string]
    }
    ```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:**
    ```
    { 
        message: [string],
        errors: [Array of string]
    }
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```


**Find All Employee**
----
  Returns array of json data about all employee.

* **URL**

  /admin/employee

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `NONE`

* **Headers Params**
    ```
    {
        token: [string]
    }

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    [
        {
            id: [integer]
            name: [string],
            password: [string],
            email:  [string],
            birthDate:  [integer],
            address:  [string],
            phoneNumber:  [string],
            role: [string],
            authLevel:  [integer],
            superior: [integer],
            authLevel:  [integer],
            createdAt:  [date],
            updatedAt: [date]
        }
    ]
    
    ```
 
* **Error Response:**

  * **Code:** 404 DATA NOT FOUND <br />
    **Content:**
    ```
    { 
        error : [string]
    }
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```


**Update Employee**
----
  Returns json data about employee data up to date.

* **URL**

  /admin/employee/:id

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   ```
   {
       id : [integer]
   }
   ```

* **Headers Params**
    ```
    {
        token: [string]
    }
    ```

* **Data Params**
    ```
    {
        name: [string],
        password: [string],
        email:  [string],
        birthDate:  [integer],
        address:  [string],
        phoneNumber:  [string],
        role: [string],
        authLevel:  [integer],
        superior: [integer],
        authLevel:  [integer],
        createdAt:  [date],
        updatedAt: [date]
    }
    ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
      { 
        id: [integer],
        name: [string],
        password: [string],
        email:  [string],
        birthDate:  [integer],
        address:  [string],
        phoneNumber:  [string],
        role: [string],
        authLevel:  [integer],
        superior: [integer],
        authLevel:  [integer],
        createdAt:  [date],
        updatedAt: [date]
    }
    ```
 
* **Error Response:**


  * **Code:** 404 DATA NOT FOUND <br />
    **Content:**
    ```
    { 
        message : [string]
    }
    ```
  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```


**Delete Products**
----
  Returns response successful delete.

* **URL**

  /admin/employee/:id

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
   ```
   {
       id : [integer]
   }
   ```

* **Headers Params**
    ```
    {
        token: [string]
    }
    ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    { 
        message: "Employee Deleted"
    }    
    ```
 
* **Error Response:**

  * **Code:** 404 DATA NOT FOUND <br />
    **Content:**
    ```
    { 
        error : [string]
    }
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```


**Generate QR**
----
  Returns response successful delete.

* **URL**

  /admin/QR

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   ```
   {
       id : [integer]
   }
   ```

* **Headers Params**
    ```
    {
        token: [string]
    }
    ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    { 
        token: [string]
    }    
    ```
 
* **Error Response:**

  * **Code:** 404 DATA NOT FOUND <br />
    **Content:**
    ```
    { 
        error : [string]
    }
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```

----

**Login Staff**
----
  Returns json data of token and payload.

* **URL**

  /employee/login'

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   `NONE`

* **Data Params**
    ```
    {
        email: [string],
        password: [string]
    }
    ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    { 
        "token" : [string],
        "payload": {
            id: [integer],
            email: [string],
            authLevel: [integer]
        }
    }
    ```
 
* **Error Response:**

  * **Code:** 401 DATA NOT FOUND <br />
    **Content:**
    ```
    { 
        message : "Email/Password invalid"
    }
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```


**Send QR**
----
  Returns object of absence data.

* **URL**

  /employee/sendQR

* **Method:**

  `POST`
  
* **Headers Params**
    ```
    {
        token: [string]
    }
    ```

* **Data Params**
    ```
    {
        jwt: [string],
        EmployeeId: [integer]
    }
    ```

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
    ```
    { 
        message: "Absence Submitted"
    }    
    ```
 OR

   * **Code:** 200 <br />
    **Content:** 
    ```
    { 
        message: "Absence Updated"
    }    
    ```
 
* **Error Response:**

  * **Code:** 400 DATA NOT FOUND <br />
    **Content:**
    ```
    { 
        message: "Invalid QR CODE"
    }
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```


**Find Employee**
----
  Returns array of json data about all employee.

* **URL**

  /admin/employee

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `NONE`

* **Headers Params**
    ```
    {
        token: [string]
    }

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    [
        {
            id: [integer]
            name: [string],
            password: [string],
            email:  [string],
            birthDate:  [integer],
            address:  [string],
            phoneNumber:  [string],
            role: [string],
            authLevel:  [integer],
            superior: [integer],
            authLevel:  [integer],
            createdAt:  [date],
            updatedAt: [date]
        }
    ]
    
    ```
 
* **Error Response:**

  * **Code:** 404 DATA NOT FOUND <br />
    **Content:**
    ```
    { 
        error : [string]
    }
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```
    { 
        error : "Internal Server Error" 
    }
    ```
