
using System.Collections.Generic;
using GalaSoft.MvvmLight.Messaging;
using SQLite;
using SumoNinjaMonkey.Framework;
using SumoNinjaMonkey.Framework.Controls.Messages;
using SumoNinjaMonkey.Framework.Services;
using System.Linq;
using Windows.Foundation;
using System;
using System.Runtime.Serialization;


namespace ModernCSApp.Services
{
    public class AppDatabase : SqliteDatabase
    {
        private static AppDatabase database = null;

        public static AppDatabase Current
        {
            get
            {
                AppDatabase result;
                lock (SqliteDatabase.lockobj)
                {
                    if (AppDatabase.database == null)
                    {
                        AppDatabase.database = new AppDatabase();
                    }
                    result = AppDatabase.database;
                }
                return result;
            }
        }



        
        private AppDatabase()
            : base("App.db")
        {

            this.SqliteDb.CreateTable<TableDasboard>();
            this.SqliteDb.CreateTable<FolderItem>();
            this.SqliteDb.CreateTable<AppState>();
            this.SqliteDb.CreateTable<UIElementState>();
            this.SqliteDb.CreateTable<Solution>();
            this.SqliteDb.CreateTable<Project>();
            this.SqliteDb.CreateTable<Scene>();

            this.SqliteDb.CreateTable<YoutubePersistedItem>();
            this.SqliteDb.CreateTable<YoutubeHistoryItem>();
        }


        #region ADD/UPDATE

        public void AddDashboardItem(int slotId, int left, int top, int width, int height, string title, string description, int column, int row)
        {
            LoggingService.LogInformation("writing to db 'TableDashboard'", "AppDatabase.AddDashboardItem");

            this.SqliteDb.Insert(new TableDasboard()
            {
                Left = left,
                Top = top,
                Width = width,
                Height = height,
                Title = title,
                Description = description,
                Ordinal = slotId,
                Column = column,
                Row = row
            });

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("inserting ...") { Identifier = "DB", SourceId = "AddDashboardItem" });

        }
        public void AddFolderItem(string title, int ordinal, string metroIcon)
        {
            LoggingService.LogInformation("writing to db 'FolderItem'", "AppDatabase.AddFolderItem");
            this.SqliteDb.Insert(new FolderItem()
            {
                Title = title,
                MetroIcon = metroIcon,
                Ordinal = ordinal
            });
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("inserting ...") { Identifier = "DB", SourceId = "AddFolderItem" });

        }
        public void AddAppState(string name, string value)
        {
            LoggingService.LogInformation("writing to db 'AppState'", "AppDatabase.AddAppState");
            this.SqliteDb.Insert(new AppState()
            {
                Name = name,
                Value = value
            });
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("inserting ...") { Identifier = "DB", SourceId = "AppState" });
        }
        private void AddUIElementState(string aggregateId,string scene, double left, double top, double scale, double width, double height, bool isRenderable, int? layoutStyle, int? layoutOrientation )
        {
            LoggingService.LogInformation("writing to db 'UIElementState'", "AppDatabase.AddUIElementState");
            this.SqliteDb.Insert(new UIElementState()
            {
                AggregateId = aggregateId,
                Scene = scene,
                Left = left,
                Top = top,
                Width = width,
                Height = height,
                Scale = scale,
                IsRenderable = isRenderable,
                LayoutStyle = layoutStyle == null ? 0 : (int)layoutStyle,
                LayoutOrientation = layoutOrientation == null ? 0 : (int)layoutOrientation
            });
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("inserting ...") { Identifier = "DB", SourceId = "UIElementState" });
        }


        public void AddUpdateUIElementState(string aggregateId, string scene, double left, double top, double width, double height, double scale, bool isRenderable, int? layoutStyle, int? layoutOrientation, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'UIElementState'", "AppDatabase.AddUpdateUIElementState");
            var found  = RetrieveUIElementState(aggregateId);

            if (found != null && found.Count()>0)
            {
                found[0].Left = left;
                found[0].Top = top;
                found[0].Width = width;
                found[0].Height = height; 
                found[0].Scale = scale;
                found[0].IsRenderable = isRenderable;
                found[0].Scene = scene;
                if (layoutStyle != null) found[0].LayoutStyle = (int)layoutStyle;
                if (layoutOrientation != null) found[0].LayoutOrientation = (int)layoutOrientation;

                this.SqliteDb.Update(found[0]);
            }
            else
            {
                AddUIElementState(aggregateId, scene, left, top, scale, width, height, isRenderable, layoutStyle, layoutOrientation);
            }
            
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "UIElementState" });

            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "UPDATED" });

        }
        public async void AddUpdateSolution(Solution solution)
        {
            LoggingService.LogInformation("writing to db 'Solution'", "AppDatabase.AddUpdateSolution");
            var found = RetrieveSolution(solution.AggregateId);

            if (found != null && found.Count() > 0)
            {
                this.SqliteDb.Update(solution);
                //await mstSolution.UpdateAsync(solution);
            }
            else
            {
                var newId = this.SqliteDb.Insert(solution);
                //await mstSolution.InsertAsync(solution);
                
            }

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "Solution" });

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = solution.AggregateId, Action = "UPDATED" });

        }
        public void AddUpdateProject(Project project)
        {
            LoggingService.LogInformation("writing to db 'Project'", "AppDatabase.AddUpdateProject");
            var found = RetrieveProject(project.AggregateId);

            if (found != null && found.Count() > 0)
            {
                this.SqliteDb.Update(project);
                //await mstProject.UpdateAsync(project);
            }
            else
            {
                var newId = this.SqliteDb.Insert(project);
                //await mstProject.InsertAsync(project);
            }

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "Project" });

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = project.AggregateId, Action = "UPDATED" });

        }
        public async void AddUpdateScene(Scene scene)
        {
            LoggingService.LogInformation("writing to db 'Scene'", "AppDatabase.AddUpdateScene");
            var found = RetrieveScene(scene.AggregateId);

            if (found != null && found.Count() > 0)
            {
                this.SqliteDb.Update(scene);
                //await mstScene.UpdateAsync(scene);
            }
            else
            {
                var newId = this.SqliteDb.Insert(scene);
                //await mstScene.InsertAsync(scene);
            }

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "Scene" });

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = scene.AggregateId, Action = "UPDATED" });

        }
        public async void AddUpdateYoutubePersistedItem(YoutubePersistedItem item)
        {
            LoggingService.LogInformation("writing to db 'Scene'", "AppDatabase.AddUpdateYoutubePersistedItem");
            var found = RetrieveYoutubePersistedItem(item.Id);
            
            if (found != null && found.Count() > 0)
            {
                this.SqliteDb.Update(item);
                //await mstScene.UpdateAsync(scene);
            }
            else
            {
                var newId = this.SqliteDb.Insert(item);
                //await mstScene.InsertAsync(scene);
            }

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "YoutubePersistedItem" });

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "YOUTUBE", AggregateId = item.Id.ToString(), Action = "UPDATED" });

        }
        public async void AddUpdateYoutubeHistoryItem(YoutubeHistoryItem item)
        {
            LoggingService.LogInformation("writing to db 'Scene'", "AppDatabase.AddUpdateYoutubeHistoryItem");
            var found = RetrieveYoutubeHistoryItem(item.Id);

            if (found != null && found.Count() > 0)
            {
                this.SqliteDb.Update(item);
            }
            else
            {
                var newId = this.SqliteDb.Insert(item);
            }

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "YoutubeHistoryItem" });

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "YOUTUBE", AggregateId = item.Id.ToString(), Action = "UPDATED" });

        }

        public void UpdateSolutionField(string aggregateId, string fieldName, object fieldValue, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'Solution'", "AppDatabase.UpdateSolutionField");
            this.SqliteDb.Execute("UPDATE Solution set " + fieldName + " = ? where aggregateId = ?", fieldValue, aggregateId);
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "Solution" });
            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "UPDATED" });
        }
        public void UpdateProjectField(string aggregateId, string fieldName, object fieldValue, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'Project'", "AppDatabase.UpdateProjectField");
            this.SqliteDb.Execute("UPDATE Project set " + fieldName + " = ? where aggregateId = ?", fieldValue, aggregateId);
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "Project" });
            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "UPDATED" });
        }
        public void UpdateSceneField(string aggregateId, string fieldName, object fieldValue, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'Scene'", "AppDatabase.UpdateSceneField");
            this.SqliteDb.Execute("UPDATE Scene set " + fieldName + " = ? where aggregateId = ?", fieldValue, aggregateId);
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "Scene" });
            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "UPDATED" });
        }







        public void UpdateUIElementStateField(string aggregateId, string fieldName, object value, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'UIElementState'", "AppDatabase.UpdateUIElementStateField");
            this.SqliteDb.Execute("UPDATE UIElementState set " + fieldName + " = ? where aggregateId = ?", value, aggregateId);
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "UIElementState" });
            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "UPDATED" });
            

        }


        public void UpdateYoutubePersistedItemField(int id, string fieldName, object value, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'YoutubePersistedItem'", "AppDatabase.UpdateYoutubePersistedItemField");
            this.SqliteDb.Execute("UPDATE YoutubePersistedItem set " + fieldName + " = ? where uid = ?", value, id);
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "UIElementState" });
            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "YOUTUBE", AggregateId = id.ToString(), Action = "UPDATED" });
        }
        public void UpdateYoutubeHistoryItemField(int id, string fieldName, object value, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'YoutubeHistoryItem'", "AppDatabase.UpdateYoutubeHistoryItemField");
            this.SqliteDb.Execute("UPDATE YoutubeHistoryItem set " + fieldName + " = ? where uid = ?", value, id);
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "UIElementState" });
            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "YOUTUBE", AggregateId = id.ToString(), Action = "UPDATED" });
        }


        public void UpdateYoutubePersistedItemField(string uid, string fieldName, object value, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'YoutubePersistedItem'", "AppDatabase.UpdateYoutubePersistedItemField");
            this.SqliteDb.Execute("UPDATE YoutubePersistedItem set " + fieldName + " = ? where uid = ?", value, uid);
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "UIElementState" });
            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "YOUTUBE", AggregateId = uid.ToString(), Action = "UPDATED" });
        }
        public void UpdateYoutubeHistoryItemField(string uid, string fieldName, object value, bool sendAggregateUpdateMessage = true)
        {
            LoggingService.LogInformation("writing to db 'YoutubeHistoryItem'", "AppDatabase.UpdateYoutubeHistoryItemField");
            this.SqliteDb.Execute("UPDATE YoutubeHistoryItem set " + fieldName + " = ? where uid = ?", value, uid);
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("updating ...") { Identifier = "DB", SourceId = "UIElementState" });
            if (sendAggregateUpdateMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "YOUTUBE", AggregateId = uid.ToString(), Action = "UPDATED" });
        }




        #endregion


        #region DELETE
        public void DeleteDashboardItem(int? id)
        {

            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'DashboardItem'", "AppDatabase.DeleteDashboardItem");
                this.SqliteDb.Delete(new TableDasboard() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId =  "DeleteDashboardItem" });
        }
        public void DeleteFolderItem(int? id)
        {
            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'FolderItem'", "AppDatabase.DeleteFolderItem");
                this.SqliteDb.Delete(new FolderItem() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId =  "DeleteFolderItem" });
        }
        public void DeleteAppState(int? id)
        {
            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'AppState'", "AppDatabase.DeleteAppState");
                this.SqliteDb.Delete(new AppState() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId =  "AppState" });
        }
        public void DeleteUIElementState(int? id)
        {
            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'UIElementState'", "AppDatabase.DeleteUIElementState");
                this.SqliteDb.Delete(new UIElementState() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "UIElementState" });
        }
        public void DeleteUIElementState(string aggregateId, bool sendAggregateDeleteMessage = true)
        {
            if (!string.IsNullOrEmpty(aggregateId))
            {
                LoggingService.LogInformation("delete from db 'UIElementState'", "AppDatabase.DeleteUIElementState");
                this.SqliteDb.Execute("delete from UIElementState where grouping1 = ?", aggregateId);
                this.SqliteDb.Execute("delete from UIElementState where grouping2 = ?", aggregateId);
                this.SqliteDb.Execute("delete from UIElementState where aggregateId = ?", aggregateId);
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "UIElementState" });
            if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }
        public void DeleteSolution(int? id)
        {
            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'Solution'", "AppDatabase.DeleteSolution");
                this.SqliteDb.Delete(new Solution() { Id = (int)id });
                //mstSolution.DeleteAsync(new Solution() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "Solution" });
            //if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }
        public void DeleteSolution(string aggregateId, bool sendAggregateDeleteMessage = true)
        {
            if (!string.IsNullOrEmpty(aggregateId))
            {
                LoggingService.LogInformation("delete from db 'Solution'", "AppDatabase.DeleteSolution");

                var found = RetrieveSolution(aggregateId);
                //mstSolution.DeleteAsync(found.First());

                this.SqliteDb.Execute("delete from Solution where aggregateId = ?", aggregateId);
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "Solution" });
            if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }
        public void DeleteSolutions(string grouping1)
        {
            if (!string.IsNullOrEmpty(grouping1))
            {
                LoggingService.LogInformation("delete from db 'Solution'", "AppDatabase.DeleteSolutions");
                this.SqliteDb.Execute("delete from Solution where Grouping1 = ?", grouping1);
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "Solution" });
            //if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }
        public void DeleteProject(int? id)
        {
            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'Project'", "AppDatabase.DeleteProject");
                this.SqliteDb.Delete(new Project() { Id = (int)id });
                //mstProject.DeleteAsync(new Project() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "Project" });
            //if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }
        public void DeleteProject(string aggregateId, bool sendAggregateDeleteMessage = true)
        {
            if (!string.IsNullOrEmpty(aggregateId))
            {
                LoggingService.LogInformation("delete from db 'Project'", "AppDatabase.DeleteProject");

                var found = RetrieveProject(aggregateId);
                //mstProject.DeleteAsync(found.First());

                this.SqliteDb.Execute("delete from Project where aggregateId = ?", aggregateId);
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "Project" });
            if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }
        public void DeleteProjects(string grouping1)
        {
            if (!string.IsNullOrEmpty(grouping1))
            {
                LoggingService.LogInformation("delete from db 'Project'", "AppDatabase.DeleteProjects");
                this.SqliteDb.Execute("delete from Project where Grouping1 = ?", grouping1);
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "Project" });
            //if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }
        public void DeleteScene(int? id)
        {
            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'Scene'", "AppDatabase.DeleteScene");
                this.SqliteDb.Delete(new Scene() { Id = (int)id });
                //mstScene.DeleteAsync(new Scene() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "Scene" });
            //if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }
        public void DeleteScene(string aggregateId, bool sendAggregateDeleteMessage = true)
        {
            if (!string.IsNullOrEmpty(aggregateId))
            {
                LoggingService.LogInformation("delete from db 'Scene'", "AppDatabase.DeleteScene");

                var found = RetrieveScene(aggregateId);
                //mstScene.DeleteAsync(found.First());

                this.SqliteDb.Execute("delete from Scene where aggregateId = ?", aggregateId);
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "Scene" });
            if (sendAggregateDeleteMessage) Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "AGGREGATE", AggregateId = aggregateId, Action = "DELETED" });
        }

        public void DeleteYoutubePersistedItems(string grouping)
        {
            if (!string.IsNullOrEmpty(grouping))
            {
                LoggingService.LogInformation("delete from db 'YoutubePersistedItem'", "AppDatabase.DeleteYoutubePersistedItems");
                this.SqliteDb.Execute("delete from YoutubePersistedItem where Grouping = ?", grouping);
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "DeleteYoutubePersistedItems" });
            
        }
        public void DeleteYoutubeHistoryItems(string grouping)
        {
            if (!string.IsNullOrEmpty(grouping))
            {
                LoggingService.LogInformation("delete from db 'YoutubeHistoryItem'", "AppDatabase.DeleteYoutubeHistoryItems");
                this.SqliteDb.Execute("delete from YoutubeHistoryItem where Grouping = ?", grouping);
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "DeleteYoutubeHistoryItems" });

        }
        public void DeleteYoutubePersistedItems(DateTime oldestTimespan)
        {

            LoggingService.LogInformation("delete from db 'YoutubePersistedItem'", "AppDatabase.DeleteOldYoutubePersistedItems");
            this.SqliteDb.Execute("delete from YoutubePersistedItem where Timestamp < ?", oldestTimespan);

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "DeleteYoutubePersistedItems" });

        }
        public void DeleteYoutubeHistoryItems(DateTime oldestTimespan)
        {

            LoggingService.LogInformation("delete from db 'YoutubePersistedItem'", "AppDatabase.DeleteYoutubeHistoryItems");
            this.SqliteDb.Execute("delete from YoutubeHistoryItem where Timestamp < ?", oldestTimespan);

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "DeleteYoutubeHistoryItems" });

        }
        #endregion


        #region RETRIEVE
        public List<TableDasboard> RetrieveDashboard()
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId =  "RetrieveDashboard" });
            LoggingService.LogInformation("retrieve from db 'TableDashboard'", "AppDatabase.RetrieveDashboard");
            return this.SqliteDb.Query<TableDasboard>("SELECT Id, Ordinal, Left, Top, Width, Height, Column, Row FROM TableDasboard");
        }
        public List<FolderItem> RetrieveFolders()
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId =  "RetrieveFolders" });
            LoggingService.LogInformation("retrieve from db 'FolderItem'", "AppDatabase.RetrieveFolders");
            return this.SqliteDb.Query<FolderItem>("SELECT Id, Ordinal, Title, MetroIcon FROM FolderItem");
        }
        public List<AppState> RetrieveAppStates()
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId =  "RetrieveAppStates" });
            LoggingService.LogInformation("retrieve from db 'AppState'", "AppDatabase.RetrieveAppStates");
            return this.SqliteDb.Query<AppState>("SELECT Id, Name, Value FROM AppState");
        }


        public List<FolderItem> RetrieveFolder(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId =  "RetrieveFolder" });
            LoggingService.LogInformation("retrieve from db 'FolderItem'", "AppDatabase.RetrieveFolder");
            return this.SqliteDb.Query<FolderItem>("SELECT Id, Ordinal, Title, MetroIcon FROM FolderItem WHERE Id = ?", id);
        }
        public List<AppState> RetrieveAppState(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveAppState" });
            LoggingService.LogInformation("retrieve from db 'AppState'", "AppDatabase.RetrieveAppState");
            return this.SqliteDb.Query<AppState>("SELECT Id, Name, Value FROM AppState WHERE Id = ?", id);
        }


        private const string _fields_UIElementState = "Id, AggregateId, Scene, Grouping1, Grouping2, Type, Left, Top, Width, Height, Scale, IsRenderable, LayoutStyle, LayoutOrientation, udfString1, udfString2, udfString3, udfString4, udfString5, udfDouble1, udfDouble2, udfDouble3, udfDouble4, udfDouble5, udfBool1, udfBool2, udfBool3, udfBool4, udfBool5, udfInt1, udfInt2, udfInt3, udfInt4, udfInt5";

        public List<UIElementState> RetrieveUIElementState(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveUIElementState" });
            LoggingService.LogInformation("retrieve from db 'UIElementState'", "AppDatabase.RetrieveUIElementState");
            return this.SqliteDb.Query<UIElementState>("SELECT " + _fields_UIElementState + "  FROM UIElementState WHERE Id = ?", id);
        }

        public List<UIElementState> RetrieveUIElementState(string aggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveUIElementState" });
            LoggingService.LogInformation("retrieve from db 'UIElementState'", "AppDatabase.RetrieveUIElementState");
            return this.SqliteDb.Query<UIElementState>("SELECT " + _fields_UIElementState + " FROM UIElementState WHERE AggregateId = ?", aggregateId);
        }

        public List<UIElementState> RetrieveUIElementStatesByGrouping(string aggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveUIElementStatesByGrouping" });
            LoggingService.LogInformation("retrieve from db 'UIElementState'", "AppDatabase.RetrieveUIElementStatesByGrouping");
            return this.SqliteDb.Query<UIElementState>("SELECT " + _fields_UIElementState + " FROM UIElementState WHERE Grouping1 = ?", aggregateId);
        }
        public List<UIElementState> RetrieveUIElementStatesByScene(string sceneAggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveUIElementStatesByScene" });
            LoggingService.LogInformation("retrieve from db 'UIElementState'", "AppDatabase.RetrieveUIElementStatesByScene");
            return this.SqliteDb.Query<UIElementState>("SELECT " + _fields_UIElementState + " FROM UIElementState WHERE Scene = ?", sceneAggregateId);
        }

        public List<Solution> RetrieveSolution(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveSolution" });
            LoggingService.LogInformation("retrieve from db 'Solution'", "AppDatabase.RetrieveSolution");
            return this.SqliteDb.Query<Solution>("SELECT * FROM Solution WHERE ID = ?", id);
        }
        public List<Solution> RetrieveSolution(string aggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveSolution" });
            LoggingService.LogInformation("retrieve from db 'Solution'", "AppDatabase.RetrieveSolution");
            return this.SqliteDb.Query<Solution>("SELECT * FROM Solution WHERE AggregateId = ?", aggregateId);
        }
        public List<Solution> RetrieveSolutionsByGrouping(string aggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveSolutionsByGrouping" });
            LoggingService.LogInformation("retrieve from db 'Solution'", "AppDatabase.RetrieveSolutionsByGrouping");
            return this.SqliteDb.Query<Solution>("SELECT * FROM Solution WHERE Grouping1 = ?", aggregateId);
        }


        public List<Project> RetrieveProject(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveProject" });
            LoggingService.LogInformation("retrieve from db 'Project'", "AppDatabase.RetrieveProject");
            return this.SqliteDb.Query<Project>("SELECT * FROM Project WHERE ID = ?", id);
        }
        public List<Project> RetrieveProject(string aggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveProject" });
            LoggingService.LogInformation("retrieve from db 'Project'", "AppDatabase.RetrieveProject");
            return this.SqliteDb.Query<Project>("SELECT * FROM Project WHERE AggregateId = ?", aggregateId);
        }
        public List<Project> RetrieveProjectsByGrouping(string aggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveProjectsByGrouping" });
            LoggingService.LogInformation("retrieve from db 'Project'", "AppDatabase.RetrieveProjectsByGrouping");
            return this.SqliteDb.Query<Project>("SELECT * FROM Project WHERE Grouping1 = ?", aggregateId);
        }
        public List<Scene> RetrieveScene(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveScene" });
            LoggingService.LogInformation("retrieve from db 'Scene'", "AppDatabase.RetrieveScene");
            return this.SqliteDb.Query<Scene>("SELECT * FROM Scene WHERE ID = ?", id);
        }
        public List<Scene> RetrieveScene(string aggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveScene" });
            LoggingService.LogInformation("retrieve from db 'Scene'", "AppDatabase.RetrieveScene");
            return this.SqliteDb.Query<Scene>("SELECT * FROM Scene WHERE AggregateId = ?", aggregateId);
        }
        public List<Scene> RetrieveScenesByGrouping(string aggregateId)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveScenesByGrouping" });
            LoggingService.LogInformation("retrieve from db 'Scene'", "AppDatabase.RetrieveScenesByGrouping");
            return this.SqliteDb.Query<Scene>("SELECT * FROM Scene WHERE Grouping1 = ?", aggregateId);
        }


        public List<YoutubePersistedItem> RetrieveYouTubeByGrouping(string grouping1)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYouTubeByGrouping" });
            LoggingService.LogInformation("retrieve from db 'YoutubePersistedItem'", "AppDatabase.RetrieveYouTubeByGrouping");
            return this.SqliteDb.Query<YoutubePersistedItem>("SELECT * FROM YoutubePersistedItem WHERE Grouping1 = ?", grouping1);
        }
        public List<YoutubeHistoryItem> RetrieveYouTubeHistoryByGrouping(string grouping1)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYouTubeHistoryByGrouping" });
            LoggingService.LogInformation("retrieve from db 'YoutubeHistoryItem'", "AppDatabase.RetrieveYouTubeHistoryByGrouping");
            return this.SqliteDb.Query<YoutubeHistoryItem>("SELECT * FROM YoutubeHistoryItem WHERE Grouping1 = ?", grouping1);
        }
        public List<YoutubePersistedItem> RetrieveYoutubePersistedItem(string uniqueid)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubePersistedItem" });
            LoggingService.LogInformation("retrieve from db 'YoutubePersistedItem'", "AppDatabase.RetrieveYoutubePersistedItem");
            return this.SqliteDb.Query<YoutubePersistedItem>("SELECT * FROM YoutubePersistedItem WHERE Uid = ?", uniqueid);
        }
        public List<YoutubeHistoryItem> RetrieveYoutubeHistoryItem(string uniqueid)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubeHistoryItem" });
            LoggingService.LogInformation("retrieve from db 'YoutubeHistoryItem'", "AppDatabase.RetrieveYoutubeHistoryItem");
            return this.SqliteDb.Query<YoutubeHistoryItem>("SELECT * FROM YoutubeHistoryItem WHERE Uid = ?", uniqueid);
        }
        public List<YoutubeHistoryItem> RetrieveYoutubeHistoryItemByID(string id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubeHistoryItem" });
            LoggingService.LogInformation("retrieve from db 'YoutubeHistoryItem'", "AppDatabase.RetrieveYoutubeHistoryItem");
            return this.SqliteDb.Query<YoutubeHistoryItem>("SELECT * FROM YoutubeHistoryItem WHERE id = ?", id);
        }
        public List<YoutubePersistedItem> RetrieveYoutubePersistedItem(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubePersistedItem" });
            LoggingService.LogInformation("retrieve from db 'YoutubePersistedItem'", "AppDatabase.RetrieveYoutubePersistedItem");
            return this.SqliteDb.Query<YoutubePersistedItem>("SELECT * FROM YoutubePersistedItem WHERE Id = ?", id);
        }
        public List<YoutubeHistoryItem> RetrieveYoutubeHistoryItem(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubeHistoryItem" });
            LoggingService.LogInformation("retrieve from db 'YoutubeHistoryItem'", "AppDatabase.RetrieveYoutubeHistoryItem");
            return this.SqliteDb.Query<YoutubeHistoryItem>("SELECT * FROM YoutubeHistoryItem WHERE Id = ?", id);
        }
        public List<YoutubePersistedItem> RetrieveYoutubePersistedItem(DateTime timestamp)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubePersistedItem" });
            LoggingService.LogInformation("retrieve from db 'YoutubePersistedItem'", "AppDatabase.RetrieveYoutubePersistedItem");
            return this.SqliteDb.Query<YoutubePersistedItem>("SELECT * FROM YoutubePersistedItem WHERE timestamp > ?", timestamp);
        }
        public List<YoutubeHistoryItem> RetrieveYoutubeHistoryItem(DateTime timestamp)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubeHistoryItem" });
            LoggingService.LogInformation("retrieve from db 'YoutubeHistoryItem'", "AppDatabase.RetrieveYoutubeHistoryItem");
            return this.SqliteDb.Query<YoutubeHistoryItem>("SELECT * FROM YoutubeHistoryItem WHERE timestamp > ?", timestamp);
        }
        public List<YoutubePersistedItem> RetrieveYoutubePersistedItemByGrouping(string grouping)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubePersistedItemByGrouping" });
            LoggingService.LogInformation("retrieve from db 'YoutubePersistedItem'", "AppDatabase.RetrieveYoutubePersistedItemByGrouping");
            return this.SqliteDb.Query<YoutubePersistedItem>("SELECT * FROM YoutubePersistedItem WHERE Grouping = ?", grouping);
        }
        public List<YoutubeHistoryItem> RetrieveYoutubeHistoryItemByGrouping(string grouping)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveYoutubeHistoryItemByGrouping" });
            LoggingService.LogInformation("retrieve from db 'YoutubeHistoryItem'", "AppDatabase.RetrieveYoutubeHistoryItemByGrouping");
            return this.SqliteDb.Query<YoutubeHistoryItem>("SELECT * FROM YoutubeHistoryItem WHERE Grouping = ?", grouping);
        }


        public bool DoesYouTubePersistedItemExist(string UID)
        {
            var found  = this.SqliteDb.Query<YoutubeHistoryItem>("SELECT * FROM YoutubePersistedItem WHERE Uid = ?", UID);
            if (found != null && found.Count() > 0)
            {
                return true;
            }

            return false;
        }
        public bool DoesYoutubeHistoryItemExist(string UID, string grouping)
        {
            var found = this.SqliteDb.Query<YoutubeHistoryItem>("SELECT * FROM YoutubeHistoryItem WHERE Uid = ? and Grouping = ?", UID, grouping);
            if (found != null && found.Count() > 0)
            {
                return true;
            }

            return false;
        }
        #endregion











        #region INSTANCES
        public List<AppState> AppStates { get; set; }


        public void LoadInstances()
        {
            this.AppStates = RetrieveAppStates();
        }
        public AppState RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums appSystemData)
        {
            var found = AppStates.Where(x => x.Name == ((int)appSystemData).ToString());
            return found.FirstOrDefault();
        }
        public void UpdateInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums appSystemData, string value)
        {
            var found = RetrieveInstanceAppState(appSystemData);
            
            if(found!=null){
                found.Value = value;
                this.SqliteDb.Update(found);
            }
        }

        #endregion

        #region SYSTEMDATA

        public enum AppSystemDataEnums
        {
            PrimaryAccentColor = 100,
            SecondaryAccentColor = 101,
            ThirdAccentColor = 102,

            PrimaryBackgroundColor = 200,
            SecondaryBackgroundColor = 201,
            ThirdBackgroundColor = 202,

            UserSessionID = 1000,
        }



        public void RecreateSystemData()
        {
            this.SqliteDb.Query<AppState>("DELETE FROM AppState");

            AddAppState(((int)AppSystemDataEnums.PrimaryAccentColor).ToString(), "84,1,102,255");  //R,G,B,A
            AddAppState(((int)AppSystemDataEnums.SecondaryAccentColor).ToString(), "128,0,156,255"); //R,G,B,A
            AddAppState(((int)AppSystemDataEnums.ThirdAccentColor).ToString(), "163,3,199,255"); //R,G,B,A


            AddAppState(((int)AppSystemDataEnums.PrimaryBackgroundColor).ToString(), "255,255,255,255");  //R,G,B,A
            AddAppState(((int)AppSystemDataEnums.SecondaryBackgroundColor).ToString(), "240,237,237,255"); //R,G,B,A
            AddAppState(((int)AppSystemDataEnums.ThirdBackgroundColor).ToString(), "226,226,226,255"); //R,G,B,A


            //new session
            string sid =  Guid.NewGuid().ToString();
            AddAppState(((int)AppSystemDataEnums.UserSessionID).ToString(), sid);
            if(Windows.UI.Xaml.Window.Current!=null)
                AddUpdateUIElementState(sid, "", 0, 0, Windows.UI.Xaml.Window.Current.Bounds.Width, Windows.UI.Xaml.Window.Current.Bounds.Height, 1, false, null, null); 
            else
                AddUpdateUIElementState(sid, "", 0, 0, 1366, 768, 1, false, null, null); 

            LoadInstances();
        }
        #endregion

        #region LAYOUT DATA


        public List<LayoutDetail> GetLayoutDetails()
        {
            List<LayoutDetail> layoutDetails = new List<LayoutDetail>();

            layoutDetails.Add(new LayoutDetail() { Dimension = new Rect(0, 0, 1366, 768), Width = 1366, Height = 768, Dpi = 148, Scale = 140, Title = "1366 x 768", MetroIcon = "Display1", DisplaySize = "10.6'" });
            layoutDetails.Add(new LayoutDetail() { Dimension = new Rect(0, 0, 1920, 1080), Width = 1920, Height = 1080, Dpi = 207, Scale = 140, Title = "1920 x 1080", MetroIcon = "Display1", DisplaySize = "10.6'" });
            layoutDetails.Add(new LayoutDetail() { Dimension = new Rect(0, 0, 2560, 1440), Width = 2560, Height = 1440, Dpi = 277, Scale = 180, Title = "2560 x 1440", MetroIcon = "Display1", DisplaySize = "10.6'" });
            layoutDetails.Add(new LayoutDetail() { Dimension = new Rect(0, 0, 1280, 800), Width = 1280, Height = 800, Dpi = 125, Scale = 100, Title = "1280 x 800", MetroIcon = "Display1", DisplaySize = "12'" });
            layoutDetails.Add(new LayoutDetail() { Dimension = new Rect(0, 0, 1920, 1080), Width = 1920, Height = 1080, Dpi = 96, Scale = 100, Title = "1920 x 1080", MetroIcon = "Display1", DisplaySize = "23'" });
            layoutDetails.Add(new LayoutDetail() { Dimension = new Rect(0, 0, 2560, 1440), Width = 2560, Height = 1440, Dpi = 109, Scale = 100, Title = "2560 x 1440", MetroIcon = "Display1", DisplaySize = "27'" });

            return layoutDetails;

        }

        public List<LayoutOrientation> GetLayoutOrientations()
        {
            List<LayoutOrientation> layoutOrientations = new List<LayoutOrientation>();
            layoutOrientations.Add(new LayoutOrientation() { Title = "Landscape", MetroIcon = "Landscape1" });
            layoutOrientations.Add(new LayoutOrientation() { Title = "Portrait", MetroIcon = "Portrait1" });

            return layoutOrientations;
        }

        public LayoutDetail GetLayoutDetail(int index)
        {
            return GetLayoutDetails()[index];
        }

        public LayoutOrientation GetLayoutOrientation(int index)
        {
            return GetLayoutOrientations()[index];
        }
        #endregion

        #region EFFECT DATA
        public List<EffectDetail> GetEffectDetails()
        {
            List<EffectDetail> ret = new List<EffectDetail>();

            ret.Add(new EffectDetail() { Title = "Affine Transform 2D", Class = "SharpDX.Direct2D1.Effects.AffineTransform2D" });
            ret.Add(new EffectDetail() { Title = "Arithmetic Composite", Class = "SharpDX.Direct2D1.Effects.ArithmeticComposite" });
            ret.Add(new EffectDetail() { Title = "Atlas", Class = "SharpDX.Direct2D1.Effects.Atlas" });
            ret.Add(new EffectDetail() { Title = "BitmapSource Effect", Class = "SharpDX.Direct2D1.Effects.BitmapSourceEffect" });
            ret.Add(new EffectDetail() { Title = "Blend", Class = "SharpDX.Direct2D1.Effects.Blend" });
            ret.Add(new EffectDetail() { Title = "Border", Class = "SharpDX.Direct2D1.Effects.Border" });
            ret.Add(new EffectDetail() { Title = "Brightness", Class = "SharpDX.Direct2D1.Effects.Brightness" });
            ret.Add(new EffectDetail() { Title = "Color Management", Class = "SharpDX.Direct2D1.Effects.ColorManagement" });
            ret.Add(new EffectDetail() { Title = "Color Matrix", Class = "SharpDX.Direct2D1.Effects.ColorMatrix" });
            ret.Add(new EffectDetail() { Title = "Composite", Class = "SharpDX.Direct2D1.Effects.Composite" });
            ret.Add(new EffectDetail() { Title = "Convolve Matrix", Class = "SharpDX.Direct2D1.Effects.ConvolveMatrix" });
            ret.Add(new EffectDetail() { Title = "Crop", Class = "SharpDX.Direct2D1.Effects.Crop" });
            ret.Add(new EffectDetail() { Title = "Directional Blur", Class = "SharpDX.Direct2D1.Effects.DirectionalBlur" });
            ret.Add(new EffectDetail() { Title = "Discrete Transfer", Class = "SharpDX.Direct2D1.Effects.DiscreteTransfer" });
            ret.Add(new EffectDetail() { Title = "Displacement Map", Class = "SharpDX.Direct2D1.Effects.DisplacementMap" });
            ret.Add(new EffectDetail() { Title = "Distant Diffuse", Class = "SharpDX.Direct2D1.Effects.DistantDiffuse" });
            ret.Add(new EffectDetail() { Title = "Distant Specular", Class = "SharpDX.Direct2D1.Effects.DistantSpecular" });
            ret.Add(new EffectDetail() { Title = "Dpi Compensation", Class = "SharpDX.Direct2D1.Effects.DpiCompensation" });
            ret.Add(new EffectDetail() { Title = "Flood", Class = "SharpDX.Direct2D1.Effects.Flood" });
            ret.Add(new EffectDetail() { Title = "Gamma Transfer", Class = "SharpDX.Direct2D1.Effects.GammaTransfer" });
            ret.Add(new EffectDetail() { Title = "Gaussian Blur", Class = "SharpDX.Direct2D1.Effects.GaussianBlur" });
            ret.Add(new EffectDetail() { Title = "Histogram", Class = "SharpDX.Direct2D1.Effects.Histogram" });
            ret.Add(new EffectDetail() { Title = "Hue Rotate", Class = "SharpDX.Direct2D1.Effects.HueRotate" });
            ret.Add(new EffectDetail() { Title = "Linear Transfer", Class = "SharpDX.Direct2D1.Effects.LinearTransfer" });
            ret.Add(new EffectDetail() { Title = "Luminance To Alpha", Class = "SharpDX.Direct2D1.Effects.LuminanceToAlpha" });
            ret.Add(new EffectDetail() { Title = "Morphology", Class = "SharpDX.Direct2D1.Effects.Morphology" });
            ret.Add(new EffectDetail() { Title = "Namespace Doc", Class = "SharpDX.Direct2D1.Effects.NamespaceDoc" });
            ret.Add(new EffectDetail() { Title = "Point Diffuse", Class = "SharpDX.Direct2D1.Effects.PointDiffuse" });
            ret.Add(new EffectDetail() { Title = "Point Specular", Class = "SharpDX.Direct2D1.Effects.PointSpecular" });
            ret.Add(new EffectDetail() { Title = "Premultiply", Class = "SharpDX.Direct2D1.Effects.Premultiply" });
            ret.Add(new EffectDetail() { Title = "Saturation", Class = "SharpDX.Direct2D1.Effects.Saturation" });
            ret.Add(new EffectDetail() { Title = "Scale", Class = "SharpDX.Direct2D1.Effects.Scale" });
            ret.Add(new EffectDetail() { Title = "Shadow", Class = "SharpDX.Direct2D1.Effects.Shadow" });
            ret.Add(new EffectDetail() { Title = "Spot Diffuse", Class = "SharpDX.Direct2D1.Effects.SpotDiffuse" });
            ret.Add(new EffectDetail() { Title = "Spot Specular", Class = "SharpDX.Direct2D1.Effects.SpotSpecular" });
            ret.Add(new EffectDetail() { Title = "Table Transfer", Class = "SharpDX.Direct2D1.Effects.TableTransfer" });
            ret.Add(new EffectDetail() { Title = "Tile", Class = "SharpDX.Direct2D1.Effects.Tile" });
            ret.Add(new EffectDetail() { Title = "Transform 3D", Class = "SharpDX.Direct2D1.Effects.Transform3D" });
            ret.Add(new EffectDetail() { Title = "Turbulence", Class = "SharpDX.Direct2D1.Effects.Turbulence" });
            ret.Add(new EffectDetail() { Title = "UnPremultiply", Class = "SharpDX.Direct2D1.Effects.UnPremultiply" });


            return ret;

        }
        #endregion

        #region FONTS

        #endregion
    }


    public class EffectDetail
    {
        public string Title { get; set; }
        public string Class { get; set; }
    }

    public class LayoutDetail
    {
        public Rect Dimension { get; set; }
        public string Title { get; set; }
        public int Dpi { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Scale { get; set; }
        public string MetroIcon { get; set; }
        public string DisplaySize { get; set; }
    }

    public class LayoutOrientation
    {
        public string Title { get; set; }
        public string MetroIcon { get; set; }
    }












    public class TableDasboard
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        
        [MaxLength(255)]
        public string Title { get; set; }

        [MaxLength(255)]
        public string Description { get; set; }

        public int Ordinal { get; set; }
        public int Left { get; set; }
        public int Top { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Column { get; set; }
        public int Row { get; set; }
    }

    public class FolderItem
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        [MaxLength(255)]
        public string Title { get; set; }

        public int Ordinal { get; set; }
        public string MetroIcon { get; set; }
        
    }

    public class AppState
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        [MaxLength(255)]
        public string Name { get; set; }

        public string Value { get; set; }

    }


    public class UIElementState
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int MSId { get; set; }
        
        public string AggregateId { get; set; }

        public string Scene { get; set; }
        public string Grouping1 { get; set; }
        public string Grouping2 { get; set; }

        public double Left { get; set; }
        public double Top { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Scale { get; set; }


        public bool IsRenderable { get; set; }
        public int LayoutStyle { get; set; }
        public int LayoutOrientation { get; set; }
        public int Type { get; set; }


        public string udfString1 { get; set; }
        public string udfString2 { get; set; }
        public string udfString3 { get; set; }
        public string udfString4 { get; set; }
        public string udfString5 { get; set; }

        public double udfDouble1 { get; set; }
        public double udfDouble2 { get; set; }
        public double udfDouble3 { get; set; }
        public double udfDouble4 { get; set; }
        public double udfDouble5 { get; set; }

        public bool udfBool1 { get; set; }
        public bool udfBool2 { get; set; }
        public bool udfBool3 { get; set; }
        public bool udfBool4 { get; set; }
        public bool udfBool5 { get; set; }

        public int udfInt1 { get; set; }
        public int udfInt2 { get; set; }
        public int udfInt3 { get; set; }
        public int udfInt4 { get; set; }
        public int udfInt5 { get; set; }

        public UIElementState()
        {
            AggregateId = "";
            Scene = "";
            Grouping1 = "";
            Grouping2 = "";

            udfString1 = "";
            udfString2 = "";
            udfString3 = "";
            udfString4 = "";
            udfString5 = "";
        }
    }


    public class Solution
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int MSId { get; set; }

        public string AggregateId { get; set; }
        public string Grouping1 { get; set; }
        public string Grouping2 { get; set; }

        public float ScaleX { get; set; }
        public float ScaleY { get; set; }
        public float RotationX { get; set; }
        public float RotationY { get; set; }
        public float TranslationX { get; set; }
        public float TranslationY { get; set; }
        public float TranslationZ { get; set; }

        public Solution()
        {
            AggregateId = "";
            Grouping1 = "";
            Grouping2 = "";

            ScaleX = 1;
            ScaleY = 1;
        }
    }

    public class Project
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int MSId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public string AggregateId { get; set; }
        public string Grouping1 { get; set; }
        public string Grouping2 { get; set; }

        public bool IsRenderable { get; set; }
        
        public float RotationY { get; set; }
        public float RotationX { get; set; }

        public float ScaleZ { get; set; }
        public float ScaleY { get; set; }
        public float ScaleX { get; set; }

        public float TranslationX { get; set; }
        public float TranslationY { get; set; }
        public float TranslationZ { get; set; }

        public float Thickness { get; set; }

        public int Type { get; set; }

        public string PathResource { get; set; }
        public string PathMenuTitle { get; set; }
        public string PathNotificationMsg { get; set; }

        public string AssetUrl { get; set; }

        public int Ordinal { get; set; }

        public Project()
        {
            Title = "";
            Description = "";
            AggregateId = "";
            Grouping1 = "";
            Grouping2 = "";
            PathResource = "";
            PathMenuTitle = "";
            PathNotificationMsg = "";
            AssetUrl = "";
            

        }
    }



    public class Scene
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int MSId { get; set; }

        public string AggregateId { get; set; }
        public string Grouping1 { get; set; }
        public string Grouping2 { get; set; }

        public long Type { get; set; }


        public string PathResource { get; set; }
        public string PathMenuTitle { get; set; }
        public string PathNotificationMsg { get; set; }

        public float TranslationX { get; set; }
        public float TranslationY { get; set; }
        public float TranslationZ { get; set; }

        public float Width { get; set; }
        public float Height { get; set; }

        public float CurrentLeft { get; set; }

        public Scene()
        {
            AggregateId = "";
            Grouping1 = "";
            Grouping2 = "";
            PathResource = "";
            PathMenuTitle = "";
            PathNotificationMsg = "";
        }
    }


    public class YoutubePersistedItem
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string Uid { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string ImagePath { get; set; }
        public double Size { get; set; }

        public string VideoId { get; set; }
        public string VideoLink { get; set; }

        public string Grouping { get; set; }
        public DateTime Timestamp { get; set; }
        public string NewUID { get; set; }

    }

    public class YoutubeHistoryItem
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string Uid { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string ImagePath { get; set; }
        public double Size { get; set; }

        public string VideoId { get; set; }
        public string VideoLink { get; set; }

        public string Grouping { get; set; }
        public DateTime Timestamp { get; set; }

        public string VideoLinkFull { get; set; }
        public string VideoLinkFullType { get; set; }

        public string UIStateFull { get; set; }
        public string NewUID { get; set; }
    }


}
