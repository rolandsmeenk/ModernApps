﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.MobileServices;
using SumoNinjaMonkey.Framework.Controls.Messages;
using GalaSoft.MvvmLight.Messaging;

namespace ModernCSApp.Services
{

    public class AzureMobileService
    {
        private static AzureMobileService _azureMobileService = null;

        public static AzureMobileService Current
        {
            get
            {
                if (AzureMobileService._azureMobileService == null)
                {
                    AzureMobileService._azureMobileService = new AzureMobileService();
                }
                return AzureMobileService._azureMobileService;
            }
        }

        private static MobileServiceClient MobileService = new MobileServiceClient(
            "https://ModernCSApp.azure-mobile.net/",
            "xaDmIaGSETNVBYCDYGrNxoXqogrLfq65"
        );

        private static IMobileServiceTable<Solution> mstSolution = MobileService.GetTable<Solution>();
        private static IMobileServiceTable<Project> mstProject = MobileService.GetTable<Project>();
        private static IMobileServiceTable<Scene> mstScene = MobileService.GetTable<Scene>();
        private static IMobileServiceTable<UIElementState> mstUIElementState = MobileService.GetTable<UIElementState>();




        private AzureMobileService()
        {
        }

        public async void PushToCloud(Project project)
        {
            if (!AppService.IsConnected()) return;

            try
            {
                if (project.MSId != 0)
                {
                    int id = project.Id;
                    project.Id = project.MSId;
                    project.MSId = id;
                    await mstProject.UpdateAsync(project);
                    project.Id = id;
                }
                else
                {
                    project.Id = 0;
                    await mstProject.InsertAsync(project);
                    AppDatabase.Current.UpdateProjectField(project.AggregateId, "MSId", project.Id, false);
                }

                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "WRITE" });
            }
            catch {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "ERROR" });
            }
        }

        public async void PushToCloud(Scene scene)
        {
            if (!AppService.IsConnected()) return;

            try
            {
                if (scene.MSId != 0)
                {
                    int id = scene.Id;
                    scene.Id = scene.MSId;
                    scene.MSId = id;
                    await mstScene.UpdateAsync(scene);
                    scene.Id = id;
                }
                else
                {
                    scene.Id = 0;
                    await mstScene.InsertAsync(scene);
                    AppDatabase.Current.UpdateSceneField(scene.AggregateId, "MSId", scene.Id, false);
                }

                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "WRITE" });
            }
            catch {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "ERROR" });
            }
        }

        public async void PushToCloud(Solution solution)
        {
            if (!AppService.IsConnected()) return;

            try{
                if (solution.MSId != 0)
                {
                    int id = solution.Id;
                    solution.Id = solution.MSId;
                    solution.MSId = id;
                    await mstSolution.UpdateAsync(solution);
                    solution.Id = id;
                }
                else
                {
                    solution.Id = 0;
                    await mstSolution.InsertAsync(solution);
                    AppDatabase.Current.UpdateSolutionField(solution.AggregateId, "MSId", solution.Id, false);
                }

                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "WRITE" });
            }
            catch {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "ERROR" });
            }
        }

        public async void PushToCloud(UIElementState uiElementState)
        {
            if (!AppService.IsConnected()) return;

            try
            {
                if (uiElementState.MSId != 0)
                {
                    int id = uiElementState.Id;
                    uiElementState.Id = uiElementState.MSId;
                    uiElementState.MSId = id;
                    await mstUIElementState.UpdateAsync(uiElementState);
                    uiElementState.Id = id;
                }
                else
                {
                    uiElementState.Id = 0;
                    await mstUIElementState.InsertAsync(uiElementState);
                    AppDatabase.Current.UpdateSolutionField(uiElementState.AggregateId, "MSId", uiElementState.Id, false);
                }

                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "WRITE" });
            }
            catch {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "ERROR" });
            }
        }

        public async void SaveSolutionsToCloud(string sessionId)
        {
            if (!AppService.IsConnected()) return;

            try{
                var items = AppDatabase.Current.RetrieveSolutionsByGrouping(sessionId);
                foreach (var item in items)
                {
                    AzureMobileService.Current.PushToCloud(item);
                }

                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "WRITE" });
            }
            catch {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "ERROR" });
            }
        }

        public async void SaveProjectsToCloud(string solutionId)
        {
            if (!AppService.IsConnected()) return;

            try{
                var items = AppDatabase.Current.RetrieveProjectsByGrouping(solutionId);
                foreach (var item in items)
                {
                    AzureMobileService.Current.PushToCloud(item);
                }

                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "WRITE" });
            }
            catch {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "ERROR" });
            }
        }

        public async void SaveScenesToCloud(string aggregateId)
        {
            if (!AppService.IsConnected()) return;

            try
            {
                var items = AppDatabase.Current.RetrieveScenesByGrouping(aggregateId);
                foreach (var item in items)
                {
                    AzureMobileService.Current.PushToCloud(item);
                }

                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "WRITE" });
            }
            catch {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "ERROR" });
            }
        }

        public async void SaveUIElementStatesToCloud(string sceneAggregateId)
        {
            if (!AppService.IsConnected()) return;

            try
            {
                var items = AppDatabase.Current.RetrieveUIElementStatesByScene(sceneAggregateId);
                foreach (var item in items)
                {
                    AzureMobileService.Current.PushToCloud(item);
                }

                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "WRITE" });
            }
            catch {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("writing ...") { Identifier = "CLOUD BAR", SourceId = "AzureMobileService", Action = "ERROR" });
            }
        }
    }
}
