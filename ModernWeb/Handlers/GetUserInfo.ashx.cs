using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ModernWeb.Handlers
{
    /// <summary>
    /// Summary description for GetUserInfo
    /// </summary>
    public class GetUserInfo : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("Hello World");
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