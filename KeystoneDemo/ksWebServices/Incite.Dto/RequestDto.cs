using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Incite.Dto
{
    /// <summary>
    /// The container to hold information required for each request to the app server. This is used by the
    /// app server to determine who is making a request, what propject they are working on, and in which database
    /// the project that they are working on lives in.
    /// </summary>
    [DataContract]
    //[Serializable]
    public class RequestDTO
    {
        [DataMember]
        public long MemberId
        {
            get;
            set;
        }

        /// <summary>
        /// Represents the database entity type - ie member, cag, dg etc. this is not an Entity framework field
        /// </summary>
        [DataMember]
        public long EntityTypeId
        {
            get;
            set;
        }

        [DataMember]
        public long ProjectId
        {
            get;
            set;
        }

        [DataMember]
        public string DatabaseName
        {
            get;
            set;
        }

        [DataMember]
        public string DatabaseServer
        {
            get;
            set;
        }

        [DataMember]
        public string SessionId
        {
            get;
            set;
        }

        //[DataMember]
        //public ProjectModes? ProjectMode
        //{
        //    get;
        //    set;
        //}

        [DataMember]
        public string Comment
        {
            get;
            set;
        }
        [DataMember]
        public long LogBookEntryTypeId
        {
            get;
            set;
        }

        [DataMember]
        public string Culture
        {
            get;
            set;
        }

        [DataMember]
        public string RequestUniqueId
        {
            get;
            set;
        }




        public override bool Equals(object obj)
        {
            var anotherRequestDto = (RequestDTO)obj;
            return anotherRequestDto.Comment == Comment
                   && anotherRequestDto.Culture == Culture
                   && anotherRequestDto.DatabaseName == DatabaseName
                   && anotherRequestDto.DatabaseServer == DatabaseServer
                   && anotherRequestDto.EntityTypeId == EntityTypeId
                //&& anotherRequestDto.IsExternalMember == IsExternalMember
                //&& anotherRequestDto.IsProjectConfigMode == IsProjectConfigMode
                   && anotherRequestDto.LogBookEntryTypeId == LogBookEntryTypeId
                   && anotherRequestDto.MemberId == MemberId
                   && anotherRequestDto.ProjectId == ProjectId
                //&& anotherRequestDto.ProjectMode == ProjectMode
                   && anotherRequestDto.SessionId == SessionId;
        }

        //public RequestDTO CloneWithRequestUniqueId(string requestUniqueId)
        //{
        //    if (string.IsNullOrEmpty(requestUniqueId)) throw new ArgumentException("Null or empty", "requestUniqueId");
        //    var newRequestDto = ObjectCloner.Clone(this);
        //    newRequestDto.RequestUniqueId = requestUniqueId;
        //    return newRequestDto;
        //}
    }
}
