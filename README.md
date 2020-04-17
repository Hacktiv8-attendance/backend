# backend

A. Employee
-login

B. Admin
-login
-addEmployee
-findAllEmployee
-findOneEmployee
-updateEmployee
-deleteEmployee

C. Absen
component: {
    ID Employee: Integer
    In: Date
    Out: Date
    WorkTime: Integer
    Status: boolean
}

-createQR (post) : {
    {new Date(), kodePerusahaan}
}

endpoint: /admin/QR

-sendQR (post) : {
    token, QR
}

/absence/sendQR

-approveAbsence (put): hasil dari approval
/absence/approve

-reject (put)
/absence/reject 

-findAll:

-findAll by EmployeeID
/absence/:EmployeeId/month


-findAll by Superior by month
/absence/manager/:SuperiorId/month

-

D. Absen Conjuction tidak ada