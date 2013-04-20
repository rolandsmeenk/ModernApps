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
    public class GetReaderBlockData : IHttpHandler
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
                    tempData += " {\"id\": 1000, \"name\": \"Work Center\" "
                    + "  , \"children\": ["
                    + "                      {\"id\": 1000001, \"name\": \"Mail\" , \"data\": \"\", \"ico\": \"ks_mb\" "
                    + "                         , \"children\": ["
                    + "                                             {\"id\": 1000001, \"name\": \"Incomming\" , \"data\": \"action|execute|filter|10\",\"isDefault\": \"true\", \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000002, \"name\": \"Unread\" , \"data\": \"action|execute|filter|20\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000003, \"name\": \"Sent\" , \"data\": \"action|execute|filter|30\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000004, \"name\": \"Chase Up\" , \"data\": \"action|execute|filter|40\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000005, \"name\": \"Outgoing\" , \"data\": \"action|execute|filter|50\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000006, \"name\": \"Invalid\" , \"data\": \"action|execute|filter|60\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000007, \"name\": \"Draft\" , \"data\": \"action|execute|filter|70\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000008, \"name\": \"Scheduled\" , \"data\": \"action|execute|filter|80\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                         ]"
                    + "                      }"
                    + "                     ,{\"id\": 1002001, \"name\": \"Tweets\" , \"data\": \"action|filter|20\", \"count\": \"\" , \"hasCreateInstance\": \"true\" , \"createInstanceAction\":\"action|location|ReaderComposeMessage01\", \"ico\": \"ks_rec\"  "
                    + "                         , \"children\": ["
                    + "                                             {\"id\": 1000001, \"name\": \"Today\" , \"data\": \"action|execute|filter|10\", \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000002, \"name\": \"Last Week\" , \"data\": \"action|execute|filter|10\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000003, \"name\": \"Last Month\" , \"data\": \"action|execute|filter|10\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000004, \"name\": \"Last 3 Months\" , \"data\": \"action|execute|filter|10\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                         ]"
                    + "                      }"
                    + "                  ]"
                    + " }"
                    + ",{\"id\": 1001, \"name\": \"Articles\" "
                    + "  , \"children\": ["
                    + "                      {\"id\": 1003001, \"name\": \"Unsorted\" , \"data\": \"action|execute|filter|10\" , \"ico\": \"ks_rec\" "
                    + "                         , \"children\": ["
                    + "                                             {\"id\": 1000001, \"name\": \"Tech\" , \"data\": \"action|execute|filter|10\", \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000002, \"name\": \"Programming\" , \"data\": \"action|execute|filter|10\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000003, \"name\": \"Games\" , \"data\": \"action|execute|filter|10\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                            ,{\"id\": 1000004, \"name\": \"Misc.\" , \"data\": \"action|execute|filter|10\", \"count\": \"\" , \"ico\": \"ks_fold\"} "
                    + "                                         ]"
                    + "                      }"
                    + "                  ]"
                    + " }"
                    + ",{\"id\": 1003, \"name\": \"Photos\" "
                    + "  , \"children\": ["
                    + "                      {\"id\": 1004001, \"name\": \"Project Photos\" , \"data\": \"action|execute|filter|10\" , \"ico\": \"ks_rec\"} "
                    + "                  ]"
                    + " }"
                    + ",{\"id\": 1008, \"name\": \"Favourites\" "
                    + "  , \"children\": ["
                    + "                      {\"id\": 1008001, \"name\": \"Technology\" , \"data\": \"action|execute|filter|10\", \"ico\": \"ks_rec\" "
                    + "                         , \"children\": ["
                    + "                             {\"id\": 1008100, \"name\": \"All\" , \"data\": \"\" ,\"hasDynamicFilter\": \"true\" , \"dynamicFilterAction\":\"action|execute|filter|20\", \"ico\": \"ks_foldplus\"} "
                    + "                         ]"
                    + "                      }"
                    + "                     ,{\"id\": 1008002, \"name\": \"Programming\" , \"data\": \"action|filter|80\", \"count\": \"\", \"ico\": \"ks_rec\" "
                    + "                         , \"children\": ["
                    + "                             {\"id\": 1008101, \"name\": \"All\" , \"data\": \"\" , \"hasDynamicFilter\": \"true\" , \"dynamicFilterAction\":\"action|execute|filter|20\", \"ico\": \"ks_foldplus\"} "
                    + "                         ]"
                    + "                      }"
                    + "                     ,{\"id\": 1008003, \"name\": \"XBox\" , \"data\": \"action|filter|90\", \"count\": \"\",  \"ico\": \"ks_rec\" "
                    + "                         , \"children\": ["
                    + "                             {\"id\": 1008102, \"name\": \"All\" , \"data\": \"\" ,\"hasDynamicFilter\": \"true\" , \"dynamicFilterAction\":\"action|execute|filter|20\", \"ico\": \"ks_foldplus\"} "
                    + "                         ]"
                    + "                      }"
                    + "                  ]"
                    + " }"
                    
                    + ",{\"id\": 1013, \"name\": \"Archive\" "
                    + "  , \"children\": ["
                    + "                      {\"id\": 1013001, \"name\": \"Last 6 months\" , \"data\": \"action|execute|filter|10\", \"ico\": \"ks_rec\"} "
                    + "                  ]"
                    + " }"
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