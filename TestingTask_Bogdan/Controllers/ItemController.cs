
using System.Data.Entity;
using System.Linq;
using System.Web.Http;





namespace TestingTask_Bogdan.Controllers
{
        
    public class ItemController : ApiController
    {
        [Route("api/GetItems")]
        public IHttpActionResult GetItems()
        {
            var db = new ApplicationContext();
            db.Items.Load();
            return Ok(db.Items.ToList());
        }

        [HttpPost]
        [Route("api/NewItem")]
        public IHttpActionResult NewItem(Item ItemToCreate)
        {
            if (ItemToCreate.Name != "" && ItemToCreate.Type != "")
            {
                var db = new ApplicationContext();
                db.Items.Add(ItemToCreate);
                db.SaveChanges();
                return Ok(ItemToCreate.Id);
            }
            else
                return BadRequest("Fields Name/Type can not be empty");
        }

        [HttpPost]
        [Route("api/EditItem")]
        public IHttpActionResult EditEtem(Item ItemToEdit)
        {
            if (ItemToEdit.Name != "" && ItemToEdit.Type != "")
            {
                var db = new ApplicationContext();
                var item = db.Items.SingleOrDefault(s => s.Id == ItemToEdit.Id);
                item.Name = ItemToEdit.Name;
                item.Type = ItemToEdit.Type;
                db.SaveChanges();
                return Ok();
            }
            else
                return BadRequest("Fields Name/Type can not be empty");
        }

        [HttpPost]
        [Route("api/DeleteItem")]
        public IHttpActionResult DeleteItem(Item ItemToDelete)
        {

                var db = new ApplicationContext();
                var item = db.Items.SingleOrDefault(s => s.Id == ItemToDelete.Id);
                db.Items.Remove(item);
                db.SaveChanges();
                return Ok();
        }




    }
}
