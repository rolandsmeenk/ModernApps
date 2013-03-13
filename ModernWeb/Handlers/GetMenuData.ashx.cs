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

            string tempData = "{ \"result\" : [";

            switch (id)
            {
                case "10":
                    tempData += " {\"id\": 1000, \"name\": \"Accordian Item 1\" "
                    + "  , \"children\": ["
                    + "                      {\"id\": 1000001, \"name\": \"Child Item 1\" , \"data\": \"action|execute|http://www.outlook.com\"} "
                    + "                     ,{\"id\": 1000002, \"name\": \"Child Item 2\" , \"data\": \"action|execute|http://www.microsoft.com\", \"count\": \"6\"} "
                    + "                     ,{\"id\": 1000003, \"name\": \"Child Item 3\" , \"data\": \"action|execute|http://www.leighton.com.au\", \"count\": \"18\"} "
                    + "                  ]"
                    + " }"
                    + ",{\"id\": 1001, \"name\": \"Accordian Item 2\" "
                    + "  , \"children\": ["
                    + "                      {\"id\": 1001001, \"name\": \"Child Item 1\" , \"data\": \"action|execute|http://msdn.microsoft.com\"} "
                    + "                     ,{\"id\": 1001002, \"name\": \"Child Item 2\" , \"data\": \"action|execute|http://www.surface.com\", \"count\": \"4\"} "
                    + "                  ]"
                    + " }"
                    + ",{\"id\": 1002, \"name\": \"Accordian Item 3\"} "
                    + ",{\"id\": 1003, \"name\": \"Accordian Item 4\"} "
                    + ",{\"id\": 1004, \"name\": \"Accordian Item 5\"} "
                    + ",{\"id\": 1005, \"name\": \"Accordian Item 6\"} "
                    + ",{\"id\": 1006, \"name\": \"Accordian Item 7\"} "
                    + ",{\"id\": 1007, \"name\": \"Accordian Item 8\" "
                    + "  , \"children\": ["
                    + "                      {\"id\": 1007001, \"name\": \"Child Item 1\" , \"data\": \"action|execute|http://www.smh.com.au\"} "
                    + "                     ,{\"id\": 1007002, \"name\": \"Child Item 2\" , \"data\": \"action|execute|http://www.abc.com.au\", \"count\": \"4\"} "
                    + "                     ,{\"id\": 1007003, \"name\": \"Child Item 3\" , \"data\": \"action|execute|http://www.stackoverflow.com\", \"count\": \"23\"} "
                    + "                     ,{\"id\": 1007004, \"name\": \"Child Item 44\" , \"data\": \"action|execute|http://www.twitter.com\"} "
                    + "                     ,{\"id\": 1007005, \"name\": \"Child Item 5\" , \"data\": \"action|execute|http://misterxmedia.livejournal.com\", \"count\": \"134\"} "
                    + "                  ]"
                    + " }"
                    + ",{\"id\": 1008, \"name\": \"Accordian Item 9\"} "
                    + ",{\"id\": 1009, \"name\": \"Accordian Item 10\"} "
                    + "]}";
                    break;
            }


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