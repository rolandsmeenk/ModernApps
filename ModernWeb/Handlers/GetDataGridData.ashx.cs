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
    public class GetDataGridData : IHttpHandler
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
                    tempData += "{\"id\": 1, \"col1\": \"col1\", \"col2\": \"col2\", \"col3\": \"col3\", \"col4\": \"col4\", \"col5\": \"col5\", \"col6\": \"col6\", \"col7\": \"col7\"} "
                    + ",{\"id\": 2, \"col1\": \"col1\", \"col2\": \"col2\", \"col3\": \"col3\", \"col4\": \"col4\", \"col5\": \"col5\", \"col6\": \"col6\", \"col7\": \"col7\"} "
                    + ",{\"id\": 3, \"col1\": \"col1\", \"col2\": \"col2\", \"col3\": \"col3\", \"col4\": \"col4\", \"col5\": \"col5\", \"col6\": \"col6\", \"col7\": \"col7\"} "
                    + ",{\"id\": 4, \"col1\": \"col1\", \"col2\": \"col2\", \"col3\": \"col3\", \"col4\": \"col4\", \"col5\": \"col5\", \"col6\": \"col6\", \"col7\": \"col7\"} "
                    + ",{\"id\": 5, \"col1\": \"col1\", \"col2\": \"col2\", \"col3\": \"col3\", \"col4\": \"col4\", \"col5\": \"col5\", \"col6\": \"col6\", \"col7\": \"col7\"} "
                    + ",{\"id\": 6, \"col1\": \"col1\", \"col2\": \"col2\", \"col3\": \"col3\", \"col4\": \"col4\", \"col5\": \"col5\", \"col6\": \"col6\", \"col7\": \"col7\"} "
                    + ",{\"id\": 7, \"col1\": \"col1\", \"col2\": \"col2\", \"col3\": \"col3\", \"col4\": \"col4\", \"col5\": \"col5\", \"col6\": \"col6\", \"col7\": \"col7\"} "
                    + ",{\"id\": 8, \"col1\": \"col1\", \"col2\": \"col2\", \"col3\": \"col3\", \"col4\": \"col4\", \"col5\": \"col5\", \"col6\": \"col6\", \"col7\": \"col7\"} ";
                    
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