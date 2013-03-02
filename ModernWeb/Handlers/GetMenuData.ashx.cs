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
    public class GetMenuData : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(retrieveData(context.Request.Form["id"]));
        }

        private string retrieveData(string id)
        {

            string tempData = "{ \"result\" : ["
            + " {\"id\": 1000, \"name\": \"Accordian Item 1\"} "
            + ",{\"id\": 1001, \"name\": \"Accordian Item 2\"} "
            + ",{\"id\": 1002, \"name\": \"Accordian Item 3\"} "
            + ",{\"id\": 1003, \"name\": \"Accordian Item 4\"} "
            + ",{\"id\": 1004, \"name\": \"Accordian Item 5\"} "
            + ",{\"id\": 1005, \"name\": \"Accordian Item 6\"} "
            + ",{\"id\": 1006, \"name\": \"Accordian Item 7\"} "
            + ",{\"id\": 1007, \"name\": \"Accordian Item 8\"} "
            + ",{\"id\": 1008, \"name\": \"Accordian Item 9\"} "
            + ",{\"id\": 1009, \"name\": \"Accordian Item 10\"} "
            + "]}";


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