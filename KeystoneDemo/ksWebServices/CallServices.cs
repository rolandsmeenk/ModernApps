using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ksWebServices
{
    public static partial class CallServices
    {




        private static async Task<srKeystoneInstanceReadOnlyService.vProjectCompanyGetByProjectIdResponse> CallInstanceAsync(string instance, string service)
        {
            var channel = CreateProxy<srKeystoneInstanceReadOnlyService.IInstanceReadOnlyService>("http://127.255.0." + instance + ":82/" + service + ".svc");

            var call = new srKeystoneInstanceReadOnlyService.vProjectCompanyGetByProjectIdRequest(2573);

            return await channel.vProjectCompanyGetByProjectIdAsync(call);
        }

        private static async Task<srKeystoneInstanceReadOnlyService.vProjectCompanyGetByProjectIdResponse> CallLoadBalancedInstanceAsync1(string instance, string service)
        {
            var channel = CreateProxy<srKeystoneInstanceReadOnlyService.IInstanceReadOnlyService>("http://" + instance + "/" + service + ".svc");

            var call = new srKeystoneInstanceReadOnlyService.vProjectCompanyGetByProjectIdRequest(2573);

            return await channel.vProjectCompanyGetByProjectIdAsync(call);
        }

        private static async Task<srPortalPortalService.CompanyGetBySeachTextResponse> CallLoadBalancedInstanceAsync2(string instance, string service)
        {
            var channel = CreateProxy<srPortalPortalService.IPortalService>("http://" + instance + "/" + service + ".svc");

            var call = new srPortalPortalService.CompanyGetBySeachTextRequest("leighton", new srPortalPortalService.RequestDTO() { });


            return await channel.CompanyGetBySeachTextAsync(call);
        }

        private static async Task<srKeystoneInstanceReadOnlyService.vProjectMemberAuthenticateUserResponse> LogInGetProjects(string instance, string service, string username, string userpass)
        {
            var channel = CreateProxy<srKeystoneInstanceReadOnlyService.IInstanceReadOnlyService>("http://" + instance + "/" + service + ".svc");

            var call = new srKeystoneInstanceReadOnlyService.vProjectMemberAuthenticateUserRequest(username, userpass);


            return await channel.vProjectMemberAuthenticateUserAsync(call);
        }

        private static async Task<srKeystoneInstanceReadOnlyService.vProjectMemberGetLoggedInMemberResponse> GetLoggedInMember(string instance, string service, long memberid, long projectid)
        {
            var channel = CreateProxy<srKeystoneInstanceReadOnlyService.IInstanceReadOnlyService>("http://" + instance + "/" + service + ".svc");

            var call = new srKeystoneInstanceReadOnlyService.vProjectMemberGetLoggedInMemberRequest(memberid, projectid, false, "xxx");


            return await channel.vProjectMemberGetLoggedInMemberAsync(call);
        }



        //

        private static async Task<srKeystoneInstanceService.ProjectGetDefaultNavigationValuesResponse> ProjectGetDefaultNavigationValues(string instance, string service, long moduleId, long memberid, long memberTypeId, long projectId, string formUniqueId, string filterName)
        {
            var channel = CreateProxy<srKeystoneInstanceService.IInstanceService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var call = new srKeystoneInstanceService.ProjectGetDefaultNavigationValuesRequest(formUniqueId, filterName, moduleId);

            return await channel.ProjectGetDefaultNavigationValuesAsync(call);
        }

        private static async Task<srKeystoneInstanceService.ProjectGetNavigationValuesByFilterTemplateKeyResponse> ProjectGetNavigationValuesByFilterTemplateKey(string instance, string service, long moduleId, long memberid, long memberTypeId, long projectId, string formUniqueId, string filterName)
        {
            var channel = CreateProxy<srKeystoneInstanceService.IInstanceService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var call = new srKeystoneInstanceService.ProjectGetNavigationValuesByFilterTemplateKeyRequest(formUniqueId, filterName, moduleId);

            return await channel.ProjectGetNavigationValuesByFilterTemplateKeyAsync(call);
        }







        //LEFT TREE


        private static async Task<srKeystoneInstanceService.BlockHeaderGetNavigationResponse> GetBlockHeaders(string instance, string service, long moduleId, long memberid, long memberTypeId, long projectId)
        {
            var channel = CreateProxy<srKeystoneInstanceService.IInstanceService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var call = new srKeystoneInstanceService.BlockHeaderGetNavigationRequest(94, memberid);


            return await channel.BlockHeaderGetNavigationAsync(call);
        }

        private static async Task<srKeystoneInstanceService.BlockHeaderGetNavigationResponse> BlockHeaderGetNavigation(string instance, string service, long moduleId, long memberid, long memberTypeId, long projectId)
        {
            var channel = CreateProxy<srKeystoneInstanceService.IInstanceService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var call = new srKeystoneInstanceService.BlockHeaderGetNavigationRequest(moduleId, memberid);

            return await channel.BlockHeaderGetNavigationAsync(call);
        }







        //LISTS 

        private static async Task<srKeystoneInstanceReadOnlyService.vProjectFormGetMessagesFilterTableResponse> GetFormsAndFiltersByFilter(string instance, string service, long moduleId, long memberid, long memberTypeId, long projectId, long filterId)
        {
            var channel = CreateProxy<srKeystoneInstanceReadOnlyService.IInstanceReadOnlyService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var criteria = new srKeystoneInstanceReadOnlyService.SearchPagingCriteriaDTO();

            criteria.ClearCriteria = false;
            criteria.DynamicFilter = null;
            criteria.ExtraCriteria = null;
            criteria.FilterId = filterId;
            criteria.FilterKind = ksWebServices.srKeystoneInstanceReadOnlyService.FilterKind.Standard;
            criteria.IsHistoryFilter = false;
            criteria.PageNumber = 1;
            criteria.PageSize = 50;
            //criteria.SearchTerm = "";
            criteria.SelectableIds = null;
            criteria.SortColumn = "SentDateTime";
            criteria.SortDesc = true;
            criteria.TimeZoneOffset = null;
            criteria.ValueFormat = ksWebServices.srKeystoneInstanceReadOnlyService.ValueFormattingMode.Default;
            criteria.WindowsTimeZoneId = null;


            var call = new srKeystoneInstanceReadOnlyService.vProjectFormGetMessagesFilterTableRequest(criteria);

            return await channel.vProjectFormGetMessagesFilterTableAsync(call);
        }

        private static async Task<srKeystoneInstanceReadOnlyService.vProjectFilterExecuteFilterWithCriteriaResponse> GetContactsByFilter(string instance, string service, long moduleId, long memberid, long memberTypeId, long projectId, long filterId)
        {
            var channel = CreateProxy<srKeystoneInstanceReadOnlyService.IInstanceReadOnlyService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var criteria = new srKeystoneInstanceReadOnlyService.SearchPagingCriteriaDTO();

            criteria.ClearCriteria = false;
            criteria.DynamicFilter = null;
            criteria.ExtraCriteria = null;
            criteria.FilterId = filterId;
            criteria.FilterKind = ksWebServices.srKeystoneInstanceReadOnlyService.FilterKind.Standard;
            criteria.IsHistoryFilter = false;
            criteria.PageNumber = 1;
            criteria.PageSize = 50;
            //criteria.SearchTerm = "";
            criteria.SelectableIds = null;
            criteria.SortColumn = "SentDateTime";
            criteria.SortDesc = true;
            criteria.TimeZoneOffset = null;
            criteria.ValueFormat = ksWebServices.srKeystoneInstanceReadOnlyService.ValueFormattingMode.Default;
            criteria.WindowsTimeZoneId = null;


            var call = new srKeystoneInstanceReadOnlyService.vProjectFilterExecuteFilterWithCriteriaRequest(criteria);

            return await channel.vProjectFilterExecuteFilterWithCriteriaAsync(call);
        }

        private static async Task<srKeystoneInstanceReadOnlyService.vProjectFilterExecuteFilterWithCriteriaFormPropertiesResponse> GetFormPropertiesViaFilter(string instance, string service, long moduleId, long memberid, long memberTypeId, long projectId, long filterId)
        {
            var channel = CreateProxy<srKeystoneInstanceReadOnlyService.IInstanceReadOnlyService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var criteria = new srKeystoneInstanceReadOnlyService.SearchPagingCriteriaDTO();

            criteria.ClearCriteria = false;
            criteria.DynamicFilter = null;
            criteria.ExtraCriteria = null;
            criteria.FilterId = filterId;
            criteria.FilterKind = ksWebServices.srKeystoneInstanceReadOnlyService.FilterKind.Standard;
            criteria.IsHistoryFilter = false;
            criteria.PageNumber = 1;
            criteria.PageSize = 50;
            //criteria.SearchTerm = "";
            criteria.SelectableIds = null;
            criteria.SortColumn = "SentDateTime";
            criteria.SortDesc = true;
            criteria.TimeZoneOffset = null;
            criteria.ValueFormat = ksWebServices.srKeystoneInstanceReadOnlyService.ValueFormattingMode.Default;
            criteria.WindowsTimeZoneId = null;

            var call = new srKeystoneInstanceReadOnlyService.vProjectFilterExecuteFilterWithCriteriaFormPropertiesRequest(criteria);

            return await channel.vProjectFilterExecuteFilterWithCriteriaFormPropertiesAsync(call);
        }





        private static async Task<srKeystoneInstanceService.PermissionRestrictionGetProxyableMembersResponse> GetProxyMembers(string instance, string service, long moduleId, long memberid, long memberTypeId, long projectId)
        {
            var channel = CreateProxy<srKeystoneInstanceService.IInstanceService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var call = new srKeystoneInstanceService.PermissionRestrictionGetProxyableMembersRequest();

            return await channel.PermissionRestrictionGetProxyableMembersAsync(call);
        }



        //ARCHIVER

        private static async Task<srKeystoneInstanceService.ArchiveRequestGetProjectArchiveRequestUiDtosResponse> GetArchiveList(string instance, string service, long memberid, long memberTypeId, long projectId)
        {
            var channel = CreateProxy<srKeystoneInstanceService.IInstanceService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var call = new srKeystoneInstanceService.ArchiveRequestGetProjectArchiveRequestUiDtosRequest();

            return await channel.ArchiveRequestGetProjectArchiveRequestUiDtosAsync(call);
        }






        // LOG BOOK

        private static async Task<srKeystoneInstanceService.AuditFindChangesResponse> AuditFindChanges(string instance, string service, long memberid, long memberTypeId, long projectId)
        {
            var channel = CreateProxy<srKeystoneInstanceService.IInstanceService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var criteria = new srKeystoneInstanceService.AuditSearchCriteriaPage();

            criteria.PageNumber = 0;
            criteria.PageSize = 10;

            criteria.Criteria = new srKeystoneInstanceService.AuditSearchCriteria();
            //criteria.Criteria.AuditActionType = null;
            //criteria.Criteria.ChildObjectId = null;
            //criteria.Criteria.ChildObjectTypeId = null;
            //criteria.Criteria.FromDate = null;
            criteria.Criteria.ProjectId = projectId;
            criteria.Criteria.ObjectName = "";
            //criteria.Criteria.ObjectId = null;
            //criteria.Criteria.ObjectTypeId = 1;
            //criteria.Criteria.ToDate = null;
            criteria.Criteria.EditedBy = new[] { new srKeystoneInstanceService.EntityIdDTO() { EntityId = memberid, EntityTypeId = memberTypeId } };


            var call = new srKeystoneInstanceService.AuditFindChangesRequest(criteria);

            return await channel.AuditFindChangesAsync(call);
        }







        // USER LIST

        private static async Task<srPortalPortalService.MemberGetListOfMembersBySearchParametersResponse> MemberGetListOfMembersBySearchParameters(string instance, string service, long memberid, long memberTypeId, long projectId)
        {
            var channel = CreateProxy<srPortalPortalService.IPortalService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var criteria = new srPortalPortalService.CompanyMemberSearchParameters();

            criteria.PageNumber = 0;
            criteria.PageSize = 10;

            criteria.SearchText = "";
            criteria.SortBy = srPortalPortalService.MemberFieldNames.LastName;
            criteria.SortOrder = srPortalPortalService.SortDirection.Descending;
            //criteria.CompanyId

            var call = new srPortalPortalService.MemberGetListOfMembersBySearchParametersRequest(criteria, new srPortalPortalService.RequestDTO() { MemberId = memberid, EntityTypeId = memberTypeId, ProjectId = projectId });

            return await channel.MemberGetListOfMembersBySearchParametersAsync(call);
        }







        // COMPANY LIST



        public static async Task<srPortalPortalService.CompanyGetAllDtosResponse> CompanyGetAllDtosRequest(string instance, string service, long memberid, long memberTypeId, long projectId)
        {
            var channel = CreateProxy<srPortalPortalService.IPortalService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);


            var call = new srPortalPortalService.CompanyGetAllDtosRequest(new srPortalPortalService.RequestDTO() { MemberId = memberid, EntityTypeId = memberTypeId, ProjectId = projectId });

            return await channel.CompanyGetAllDtosAsync(call);
        }



        public static async Task<srPortalPortalService.CompanyGetBySeachTextResponse> CompanyGetBySeachText(string instance, string service, long memberid, long memberTypeId, long projectId, string searchText)
        {
            var channel = CreateProxy<srPortalPortalService.IPortalService>("http://" + instance + "/" + service + ".svc", memberid, projectId, memberTypeId);

            var call = new srPortalPortalService.CompanyGetBySeachTextRequest(searchText, new srPortalPortalService.RequestDTO() { MemberId = memberid, EntityTypeId = memberTypeId, ProjectId = projectId });

            return await channel.CompanyGetBySeachTextAsync(call);
        }









        // =========
        // UTILITIES
        // =========


        //PLUMBING TO INJECT REQUESTDTO INTO THE PROXY HEADERS FOR EACH CALL
        //THIS IS NEEDED BY KEYSTONE SERVICES
        private static T CreateProxy<T>(string endpointAddress, long memberId = 0, long projectId = 0, long memberTypeId = 0)
        {

            TimeSpan callTimeout = new TimeSpan(0, 0, 30, 0);


            var binding = GetBinding(endpointAddress, callTimeout);

            var address = new EndpointAddress(endpointAddress);
            var channelFactory = new ChannelFactory<T>(binding, address);

            //foreach (OperationDescription op in channelFactory.Endpoint.Contract.Operations)
            //{
            //    //op.OperationBehaviors.Remove(DataContractSerializerOperationBehavior);

            //    op.OperationBehaviors.Add(new ReferencePreservingDataContractSerializerOperationBehavior(op)
            //    {
            //        MaxItemsInObjectGraph = int.MaxValue
            //    });
            //}

            //channelFactory.Endpoint.Behaviors.Add(new ExceptionMarshallingBehavior());
            //channelFactory.Endpoint.Behaviors.Add(new CacheInfoMarshallingBehavior());


            var reb = new RequestDtoEndpointBehavior();
            reb.SetRequestDTODetails(memberId, projectId, memberTypeId);
            channelFactory.Endpoint.EndpointBehaviors.Add(reb);


            T channel = channelFactory.CreateChannel();
            ((ICommunicationObject)channel).Open();

            return channel;
        }

        private static System.ServiceModel.Channels.Binding GetBinding(string endPointAddress, TimeSpan callTimeout)
        {

            return CreateBasicHttpBinding(callTimeout);


        }

        private static System.ServiceModel.Channels.Binding CreateBasicHttpBinding(TimeSpan callTimeout)
        {
            var basicHttpBinding = new BasicHttpBinding(BasicHttpSecurityMode.None)
            {
                AllowCookies = false,
                SendTimeout = callTimeout,
                ReceiveTimeout = callTimeout,
                //BypassProxyOnLocal = false,
                //HostNameComparisonMode = HostNameComparisonMode.StrongWildcard,
                TextEncoding = System.Text.Encoding.UTF8,
                TransferMode = TransferMode.Buffered,
                MaxReceivedMessageSize = 2147483647,
                ReaderQuotas = XmlDictionaryReaderQuotas.Max
            };

            //#if SERVICE_INPROC
            //                basicHttpBinding.UseDefaultWebProxy = false;
            //#endif

            var custBinding = new CustomBinding(basicHttpBinding);
            for (int i = 0; i < custBinding.Elements.Count; i++)
            {
                if (custBinding.Elements[i] is TextMessageEncodingBindingElement)
                {
                    var binaryMessageEncodingBindingElement = new BinaryMessageEncodingBindingElement(); ;
                    binaryMessageEncodingBindingElement.ReaderQuotas.MaxArrayLength =
                        binaryMessageEncodingBindingElement.ReaderQuotas.MaxDepth =
                        binaryMessageEncodingBindingElement.ReaderQuotas.MaxBytesPerRead =
                        binaryMessageEncodingBindingElement.ReaderQuotas.MaxNameTableCharCount =
                        binaryMessageEncodingBindingElement.ReaderQuotas.MaxStringContentLength = int.MaxValue;
                    custBinding.Elements[i] = binaryMessageEncodingBindingElement;
                }
            }

            return custBinding;
        }
    }
















    class ReferencePreservingDataContractSerializerOperationBehavior : DataContractSerializerOperationBehavior
    {
        public ReferencePreservingDataContractSerializerOperationBehavior(OperationDescription operationDescription)
            : base(operationDescription) { }

        public override XmlObjectSerializer CreateSerializer(Type type, string name, string ns, IList<Type> knownTypes)
        {
            return CreateDataContractSerializer(type, name, ns, knownTypes);
        }
        private static XmlObjectSerializer CreateDataContractSerializer(Type type, string name, string ns, IList<Type> knownTypes)
        {
            return CreateDataContractSerializer(type, name, ns, knownTypes);
        }
        public override XmlObjectSerializer CreateSerializer(Type type, XmlDictionaryString name, XmlDictionaryString ns, IList<Type> knownTypes)
        {
            return new DataContractSerializer(type, name, ns, knownTypes);
            //MaxItemsInObjectGraph,
            //IgnoreExtensionDataObject,
            //true/*preserveObjectReferences*/,
            //DataContractSurrogate);

        }
    }

    [DataContract]
    class WcfServerRequestHeader
    {
        [DataMember]
        public string RequestId { get; set; }
        [DataMember]
        public DateTime StartedOn { get; set; }

        public static WcfServerRequestHeader CreateNew()
        {
            return new WcfServerRequestHeader
            {
                RequestId = Guid.NewGuid().ToString(),
                StartedOn = DateTime.UtcNow
            };
        }
    }




    public class RequestDtoEndpointBehavior : Attribute, IEndpointBehavior, IContractBehavior //, IServiceBehavior
    {
        long _memberId = 0;
        long _projectId = 0;
        long _memberTypeId = 0;

        public void SetRequestDTODetails(long memberId = 0, long projectId = 0, long memberTypeId = 0)
        {
            _memberId = memberId;
            _projectId = projectId;
            _memberTypeId = memberTypeId;
        }

        void IEndpointBehavior.Validate(ServiceEndpoint endpoint)
        {
        }

        void IEndpointBehavior.AddBindingParameters(ServiceEndpoint endpoint, BindingParameterCollection bindingParameters)
        {
        }

        void IEndpointBehavior.ApplyDispatchBehavior(ServiceEndpoint endpoint, EndpointDispatcher endpointDispatcher)
        {
        }

        void IEndpointBehavior.ApplyClientBehavior(ServiceEndpoint endpoint, ClientRuntime clientRuntime)
        {
            var clientMessageInspector = new RequestDtoMessageInspector();
            clientMessageInspector.SetRequestDTODetails(_memberId, _projectId, _memberTypeId);
            clientRuntime.ClientMessageInspectors.Add(clientMessageInspector);
        }

        void IContractBehavior.Validate(ContractDescription contractDescription, ServiceEndpoint endpoint)
        {
        }

        void IContractBehavior.ApplyDispatchBehavior(ContractDescription contractDescription, ServiceEndpoint endpoint, DispatchRuntime dispatchRuntime)
        {
            //ApplyDispatchBehavior(dispatchRuntime.ChannelDispatcher);
        }

        void IContractBehavior.ApplyClientBehavior(ContractDescription contractDescription, ServiceEndpoint endpoint, ClientRuntime clientRuntime)
        {
        }

        void IContractBehavior.AddBindingParameters(ContractDescription contractDescription, ServiceEndpoint endpoint, BindingParameterCollection bindingParameters)
        {
        }

        //void IServiceBehavior.Validate(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
        //{
        //}

        //void IServiceBehavior.AddBindingParameters(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase, Collection<ServiceEndpoint> endpoints, BindingParameterCollection bindingParameters)
        //{
        //}

        //void IServiceBehavior.ApplyDispatchBehavior(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
        //{
        //    foreach (ChannelDispatcher channelDispatcher in serviceHostBase.ChannelDispatchers)
        //    {
        //        ApplyDispatchBehavior(channelDispatcher);
        //    }
        //}

        //private void ApplyDispatchBehavior(ChannelDispatcher dispatcher)
        //{
        //    var addInspectorTo = dispatcher.Endpoints
        //        .Select(x => x.DispatchRuntime.MessageInspectors)
        //        .Where(inspectors => !inspectors.OfType<RequestDtoMessageInspector>().Any());

        //    foreach (var inspectors in addInspectorTo)
        //        inspectors.Add(new RequestDtoMessageInspector());
        //}
    }

    public class RequestDtoMessageInspector : IClientMessageInspector //, IDispatchMessageInspector
    {
        public const string RequestDtoCustomHeader = "X-Incite-RequestDto";
        //private static readonly ILogger logger = Logger.GetLogger(typeof(InProcessHost));

        long _memberId = 0;
        long _projectId = 0;
        long _memberTypeId = 0;

        public void SetRequestDTODetails(long memberId = 0, long projectId = 0, long memberTypeId = 0)
        {
            _memberId = memberId;
            _projectId = projectId;
            _memberTypeId = memberTypeId;
        }


        public RequestDtoMessageInspector()
        {
        }

        public object BeforeSendRequest(ref Message request, IClientChannel channel)
        {
            //Profiler.Mark(ProfilingArea.Request, "Start : RequestDtoMessageInspector.BeforeSendRequest()");

            //if the client proxy this request is coming from does not have the Container configured then this may throw
            //an unhandled exception.
            //var requestState = Container.Container.Current.Resolve<IRequestState>();

            // retrieve the requestdto
            //var rDto = requestState.Get<RequestDTO>("requestdto");
            //var requestDto = JsonConvert.SerializeObject(rDto);

            //Profiler.Mark(ProfilingArea.Request, " - finished serializing rDto");
            Incite.Dto.RequestDTO rDto = new Incite.Dto.RequestDTO();


            rDto.ProjectId = _projectId;
            rDto.MemberId = _memberId;
            rDto.EntityTypeId = _memberTypeId;

            var requestDto = JsonConvert.SerializeObject(rDto);

            request.Headers.Add(MessageHeader.CreateHeader("RequestDto", "Incite", requestDto));

            //Profiler.Mark(ProfilingArea.Request, "End : RequestDtoMessageInspector.BeforeSendRequest()");


            //var header = WcfServerRequestHeader.CreateNew();
            //request.Headers.Add(MessageHeader.CreateHeader("WcfRequestHeader", "Incite", header));

            return null;

        }

        public void AfterReceiveReply(ref Message reply, object correlationState)
        {
        }

        // IDispatchMessageInspector

        // This is called on the server side, before the wcf call is made, read the rdto from the http headers
        // deserialize and store in the request state
        public object AfterReceiveRequest(ref Message request, IClientChannel channel, InstanceContext instanceContext)
        {
            //Profiler.Mark(ProfilingArea.Request, "Start : RequestDtoMessageInspector.AfterReceiveRequest()");

            var rdto = request.Headers.GetHeader<string>("RequestDto", "Incite");

            if (String.IsNullOrEmpty(rdto))
            {
                throw new Exception("RequestDto not found in wcf message header!");
            }

            //var requestDto = JsonConvert.DeserializeObject<RequestDTO>(rdto);

            //var requestState = Container.Container.Current.Resolve<IRequestState>();
            //requestState.Set("requestdto", requestDto);

            //var container = Container.Container.Current.CreateChildContainer();
            //requestState.Set("container", container);


            //Profiler.Mark(ProfilingArea.Request, "End : RequestDtoMessageInspector.AfterReceiveRequest() - returning a valid child container");

            //return container;
            return null;
        }

        public void BeforeSendReply(ref Message reply, object correlationState)
        {
            //var container = correlationState as IContainer;

            //if (container != null)
            //{
            //    container.Dispose();
            //}
        }

    }


}
