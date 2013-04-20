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
                    tempData += "{\"id\": 1,\"gid\": 10, \"name\": \"User 1 (Lazy Blue)\"} "
                    + ",{\"id\": 2,\"gid\": 50, \"name\": \"User 2 (Fluro Pink)\"} "
                    + ",{\"id\": 3,\"gid\": 40, \"name\": \"User 3 (Forest Green)\"} "
                    + ",{\"id\": 4,\"gid\": 60, \"name\": \"User 4 (Deep Red)\"} "
                    + ",{\"id\": 5,\"gid\": 20, \"name\": \"User 5 (Orange)\"} "
                    + ",{\"id\": 6,\"gid\": 30, \"name\": \"User 6 (Magestic Purple)\"} "
                    + ",{\"id\": 7,\"gid\": 70, \"name\": \"User 7 (Aged Yellow)\"} "
                    
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