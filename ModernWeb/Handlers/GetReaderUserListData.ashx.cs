using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Table;
using System.Configuration;

namespace ModernWeb.Handlers
{
    public class GetReaderUserListData : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(retrieveData(context.Request.Form["id"]));
        }

        private string retrieveData(string id)
        {

            string tempData = "{ \"result\" : [";

            switch (id)
            {
                case "10":
                    tempData += "{\"id\": 1,\"gid\": 10, \"name\": \"Theme (Lazy Blue)\"} "
                    + ",{\"id\": 2,\"gid\": 50, \"name\": \"Theme (Fluro Pink)\"} "
                    + ",{\"id\": 3,\"gid\": 40, \"name\": \"Theme (Forest Green)\"} "
                    + ",{\"id\": 4,\"gid\": 60, \"name\": \"Theme (Deep Red)\"} "
                    + ",{\"id\": 5,\"gid\": 20, \"name\": \"Theme (Orange)\"} "
                    + ",{\"id\": 6,\"gid\": 30, \"name\": \"Theme (Magestic Purple)\"} "
                    + ",{\"id\": 7,\"gid\": 70, \"name\": \"Theme (Aged Yellow)\"} "
                    
                    ;
                    break;
            }

            tempData += "]}";

            return tempData;

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