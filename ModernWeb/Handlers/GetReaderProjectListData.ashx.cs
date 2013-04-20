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
    public class GetReaderProjectListData : IHttpHandler
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
                    tempData += "{\"id\": 10, \"name\": \"Group 1\"} "
                    + ",{\"id\": 20, \"name\": \"Group 2\"} "
                    + ",{\"id\": 30, \"name\": \"Group 3\"} "
                    + ",{\"id\": 40, \"name\": \"Group 4\"} "
                    + ",{\"id\": 50, \"name\": \"Group 5\"} "
                    + ",{\"id\": 60, \"name\": \"Group 6\"} "
                    + ",{\"id\": 70, \"name\": \"Group 7\"} "
                    + ",{\"id\": 80, \"name\": \"Group 8\"} "

                    + ",{\"id\": 120, \"name\": \"Group 9\"} "
                    + ",{\"id\": 130, \"name\": \"Group 10\"} "
                    + ",{\"id\": 140, \"name\": \"Group 11\"} "
                    + ",{\"id\": 150, \"name\": \"Group 12\"} "
                    + ",{\"id\": 160, \"name\": \"Group 13\"} "
                    + ",{\"id\": 170, \"name\": \"Group 14\"} "
                    + ",{\"id\": 180, \"name\": \"Group 15\"} "

                    + ",{\"id\": 220, \"name\": \"Group 16\"} "
                    + ",{\"id\": 230, \"name\": \"Group 17\"} "
                    + ",{\"id\": 240, \"name\": \"Group 18\"} "
                    + ",{\"id\": 250, \"name\": \"Group 19\"} "
                    + ",{\"id\": 260, \"name\": \"Group 20\"} "
                    + ",{\"id\": 270, \"name\": \"Group 21\"} "
                    + ",{\"id\": 280, \"name\": \"Group 22\"} "
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