
using API.Models.Entities; // Add this line if Item class is in the Models namespace

namespace API.Data
{
    public class DBInitializer
    {
        public static void Initialize(StoreContext context)
        {
            if (context.Items.Any() || context.Units.Any() || context.OCRItems.Any() || context.Events.Any() || context.EventItems.Any())
            {
                return;
            }

            var items = new List<Item>
            {
                new() { Name = "COTTON APPLICATOR 15CM", Description = "description of COTTON APPLICATOR 15CM", Img="https://s2.loli.net/2024/12/03/mcKlnifJC7RbHoF.jpg",LastEditTime=DateTime.Now },
                new() { Name = "Air Injection & Irrigation Cannula", Description = "description of Air Injection & Irrigation Cannula", Img="https://s2.loli.net/2024/12/03/k1tnKq9zIZb7UoR.jpg",LastEditTime=DateTime.Now } ,
                new() { Name = "APPLICATOR 7.5CM SINGLE-ENDED",  Description = "description of APPLICATOR 7.5CM SINGLE-ENDED", Img="https://s2.loli.net/2024/12/03/UzSwDJQevNIpX4q.jpg" ,LastEditTime=DateTime.Now} ,
                new() { Name = "SEALED EDGE EYE PAD",  Description = "description of SEALED EDGE EYE PAD" , Img="https://s2.loli.net/2024/12/03/NVk1oX9gIfqpuPb.jpg",LastEditTime=DateTime.Now },
                new() { Name = "BD Venflonª I", Description = "Item5 Description", Img="https://s2.loli.net/2024/12/03/MoUnTxuVmiD6CsW.jpg" ,LastEditTime=DateTime.Now }
            };

            var Units = new List<Unit>
            {
                new Unit { Name = "pack", ItemId = items[0].Id, Item = items[0], Img="https://s2.loli.net/2024/12/03/mcKlnifJC7RbHoF.jpg" },
                new Unit { Name = "Box", ItemId = items[1].Id, Item = items[1], Img="https://s2.loli.net/2024/12/03/k1tnKq9zIZb7UoR.jpg" },
                new Unit { Name = "pack", ItemId = items[2].Id, Item = items[2], Img="https://s2.loli.net/2024/12/03/UzSwDJQevNIpX4q.jpg" },
                new Unit { Name = "pack", ItemId = items[3].Id, Item = items[3], Img="https://s2.loli.net/2024/12/03/NVk1oX9gIfqpuPb.jpg" },
                new Unit { Name = "pack", ItemId = items[4].Id, Item = items[4] , Img="https://s2.loli.net/2024/12/03/MoUnTxuVmiD6CsW.jpg" }
            };

            var OCRItems = new List<OCRItem>
            {
                new OCRItem { Item = items[0], OCRKeyword = "COTTON APPLICATOR 15CM SINGLE ENDED 5'S RE-ORDER 40061050063 E.O STERILIZED B/N: ZD240050124 EXP: 2029/01 SINGLE USE ONLY. NANJING LUSTRE MEDICAL & HEALTHCARE PRODUCTS CO.,LTD", Unit = Units[0] },
                 new OCRItem { Item = items[1], OCRKeyword = "Air Injection & Irrigation Cannula Anterior Chamber - 27G (10 Pes.) Maxiflo BME (01) 4 8906025 96309 4 (10) MIPL/E8/A3/30 Ophthalmic Cannulas (17) 202802 Catalogue No. [REF] MIPL/E8/A3 Mfg. Date ('] 2023-03 MIPL/E8/A3/30 Expiry Date $2 202 Phase-l, New Delhi-110020 India Phase-I, New Delhi-110020 India Issue Dt 01.05.2020", Unit = Units[1] },
                  new OCRItem { Item = items[2], OCRKeyword = "APPLICATOR 7.5CM SINGLE-ENDED 5ÕS RE-ORDER 40061020063 E.O STERILIZED B/N: ZD240130524 Ñ EXP.: 2029-05 STERILE SINGLE USE ONLY. NANJING LUSTRE MEDICAL & HEALTHCARE PRODUCTS CO.,LTD", Unit = Units[2]},
                   new OCRItem { Item = items[3], OCRKeyword = "CONTENTS: 1 - SEALED EDGE EYE PAD 03248907 b3 2028.12 i ail Vernacare we Advena Ltd. Tower Business Centre, 2\" Fir. Tower Street, Swatar, BKR 4013, Malta Vemacare Limited, 1 Western Avenue, Matrix Park, Chorley, Lancashire. PR7 7NB Tel: +44(0)1772 299900. Email: info@vernacare.com Wwww.vernacare.com $U248 REV0O2", Unit = Units[3]},
                    new OCRItem { Item = items[4], OCRKeyword = "£3BD Venflon™ I sal 2607 Dc aE Fl 1M 4 herapy AB, BD Instaflash Needle Technology Plelingborg:Swedens BD Luer-Lok India bd.com 206 1.0X 32mm", Unit = Units[4]},
            };
            var Events = new List<Event>
            {
                new Event { Name = "Surgery 1", Time = DateTime.Now, DoctorName = "Doctor1", PatientName = "Patient1", TheaterNumber = "Theater1",LastEditPerson="Doctor1",LastEditTime=DateTime.Now },
                new Event { Name = "Event2", Time = DateTime.Now, DoctorName = "Doctor2", PatientName = "Patient2", TheaterNumber = "Theater2",LastEditPerson="Doctor2",LastEditTime=DateTime.Now }
            };

            var EventItems = new List<EventItem>
            {
                new EventItem { Event = Events[0], Item = items[0], Quantity = 1, EditTime = DateTime.Now, Unit = Units[0] },
                new EventItem { Event = Events[0], Item = items[1], Quantity = 2, EditTime = DateTime.Now, Unit = Units[1] },
                new EventItem { Event = Events[0], Item = items[2], Quantity = 3, EditTime = DateTime.Now, Unit = Units[2] },
                new EventItem { Event = Events[1], Item = items[3], Quantity = 4, EditTime = DateTime.Now, Unit = Units[3]},
                new EventItem { Event = Events[1], Item = items[4], Quantity = 5, EditTime = DateTime.Now, Unit = Units[4] }
            };

            context.Items.AddRange(items);
            context.Units.AddRange(Units);

            context.OCRItems.AddRange(OCRItems);
            context.Events.AddRange(Events);
            context.EventItems.AddRange(EventItems);
            context.SaveChanges();
        }
    }
}