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
    public class GetReaderDataGridData : IHttpHandler
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

                    tempData += "{\"id\": " + "0" + ", \"col1\": \"Lorem Epsum Lorem Epsum \", \"col2\": \"Lorem Epsum, Lorem Epsum  \", \"col3\": \"01/12/2013 12:01 AM\", \"col4\": \"Lorem Epsum Lorem Epsum \", \"col5\": \"Lorem Epsum \", \"col6\": \"Active\", \"col7\": \"$56,000.00\", \"isDefault\": \"true\"} ";

                    for (int i = 1; i < 40; i++)
                    {
                        tempData += ",{\"id\": " + i.ToString() + ", \"col1\": \"Lorem Epsum Lorem Epsum \", \"col2\": \"Lorem Epsum, Lorem Epsum  \", \"col3\": \"01/12/2013 12:01 AM\", \"col4\": \"Lorem Epsum Lorem Epsum \", \"col5\": \"Lorem Epsum \", \"col6\": \"Active\", \"col7\": \"$56,000.00\"} ";
                    }

                    break;
                default:
                    
                    tempData += "{\"id\": " + "0" + ", \"col1\": \"Lorem Epsum Lorem Epsum \", \"col2\": \"Lorem Epsum, Lorem Epsum  \", \"col3\": \"01/12/2013 12:01 AM\", \"col4\": \"Lorem Epsum Lorem Epsum \", \"col5\": \"Lorem Epsum \", \"col6\": \"Active\", \"col7\": \"$56,000.00\", \"isDefault\": \"true\"} ";

                    for (int i = 1; i < 40; i++)
                    {
                        tempData += ",{\"id\": " + i.ToString() + ", \"col1\": \"Lorem Epsum Lorem Epsum \", \"col2\": \"Lorem Epsum, Lorem Epsum  \", \"col3\": \"01/12/2013 12:01 AM\", \"col4\": \"Lorem Epsum Lorem Epsum \", \"col5\": \"Lorem Epsum \", \"col6\": \"Active\", \"col7\": \"$56,000.00\"} ";
                    }

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