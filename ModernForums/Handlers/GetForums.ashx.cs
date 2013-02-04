using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Table;
using System.Configuration;

namespace ModernForums.Handlers
{
    public class GetForums : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(retrieveForums());
        }

        private string retrieveForums()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);

           
            //var tableClient = storageAccount.CreateCloudTableClient();
            var blobClient = storageAccount.CreateCloudBlobClient();

            //using (var service = tableClient.GetTableServiceContext())
            //{
                
            //}
            
            //var cloudTable = tableClient.GetTableReference("f-f-metadata");
            var cloudContainer = blobClient.GetContainerReference("f-f-metadata");



            if (cloudContainer.Exists())
            {
                return "true";
            }
            else
            {
                if (cloudContainer.CreateIfNotExists())
                {

                }
            }

            





            return "false";
        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}