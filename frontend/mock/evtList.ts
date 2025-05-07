export default {
    'GET /api/Event': {
    "success": true,
        "data": {
            eventList: [
                {
                    "time": "2024-12-13 16:11:24",
                    "lastEditTime": "2024-12-13 16:11:24",
                    "id": 1,
                    "name": "Surgery 1",
                    "doctorName": "Doctor",
                    "patientName": "Patient",
                    "theaterNumber": "Theater1",
                    "lastEditPerson": "Doctor1"
                },
                {
                    "time": "2024-12-13 16:11:24",
                    "lastEditTime": "2024-12-13 16:11:24",
                    "id": 2,
                    "name": "Event2",
                    "doctorName": "Doctor",
                    "patientName": "Patient",
                    "theaterNumber": "Theater2",
                    "lastEditPerson": "Doctor2"
                }
            ],
            total: 2
        },
            "message": "Success"
    },
    'DELETE /api/Event/:id': {
        "success": true
    },
}