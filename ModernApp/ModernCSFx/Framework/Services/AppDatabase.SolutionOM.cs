
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
    public partial class AppDatabase
    {



        //ADD/UPDATE

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

            var found = RetrieveAppState(name);
            if (found != null && found.Count() > 0)
            {
                found[0].Value = value;
                this.SqliteDb.Update(found[0]);
                //await mstSolution.UpdateAsync(solution);
            }
            else
            {
                this.SqliteDb.Insert(new AppState()
                {
                    Name = name,
                    Value = value
                });
            }

            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("inserting ...") { Identifier = "DB", SourceId = "AppState" });
        }
        private void AddUIElementState(string aggregateId, string scene, double left, double top, double scale, double width, double height, bool isRenderable, int? layoutStyle, int? layoutOrientation)
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
            var found = RetrieveUIElementState(aggregateId);

            if (found != null && found.Count() > 0)
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






        //DELETE
        public void DeleteDashboardItem(int? id)
        {

            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'DashboardItem'", "AppDatabase.DeleteDashboardItem");
                this.SqliteDb.Delete(new TableDasboard() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "DeleteDashboardItem" });
        }
        public void DeleteFolderItem(int? id)
        {
            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'FolderItem'", "AppDatabase.DeleteFolderItem");
                this.SqliteDb.Delete(new FolderItem() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "DeleteFolderItem" });
        }
        public void DeleteAppState(int? id)
        {
            if (id != null)
            {
                LoggingService.LogInformation("delete from db 'AppState'", "AppDatabase.DeleteAppState");
                this.SqliteDb.Delete(new AppState() { Id = (int)id });
            }
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "AppState" });
        }
        public void DeleteAppStates()
        {
            LoggingService.LogInformation("delete * 'AppState'", "AppDatabase.DeleteAppState");
            this.SqliteDb.DeleteAll<AppState>();
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("deleting ...") { Identifier = "DB", SourceId = "AppStates" });
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






        //RETRIEVE
        public List<TableDasboard> RetrieveDashboard()
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveDashboard" });
            LoggingService.LogInformation("retrieve from db 'TableDashboard'", "AppDatabase.RetrieveDashboard");
            return this.SqliteDb.Query<TableDasboard>("SELECT Id, Ordinal, Left, Top, Width, Height, Column, Row FROM TableDasboard");
        }
        public List<FolderItem> RetrieveFolders()
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveFolders" });
            LoggingService.LogInformation("retrieve from db 'FolderItem'", "AppDatabase.RetrieveFolders");
            return this.SqliteDb.Query<FolderItem>("SELECT Id, Ordinal, Title, MetroIcon FROM FolderItem");
        }
        public List<AppState> RetrieveAppStates()
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveAppStates" });
            LoggingService.LogInformation("retrieve from db 'AppState'", "AppDatabase.RetrieveAppStates");
            return this.SqliteDb.Query<AppState>("SELECT Id, Name, Value FROM AppState");
        }


        public List<FolderItem> RetrieveFolder(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveFolder" });
            LoggingService.LogInformation("retrieve from db 'FolderItem'", "AppDatabase.RetrieveFolder");
            return this.SqliteDb.Query<FolderItem>("SELECT Id, Ordinal, Title, MetroIcon FROM FolderItem WHERE Id = ?", id);
        }
        public List<AppState> RetrieveAppState(int id)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveAppState" });
            LoggingService.LogInformation("retrieve from db 'AppState'", "AppDatabase.RetrieveAppState");
            return this.SqliteDb.Query<AppState>("SELECT Id, Name, Value FROM AppState WHERE Id = ?", id);
        }
        public List<AppState> RetrieveAppState(string name)
        {
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("retrieving ...") { Identifier = "DB", SourceId = "RetrieveAppState" });
            LoggingService.LogInformation("retrieve from db 'AppState'", "AppDatabase.RetrieveAppState");
            return this.SqliteDb.Query<AppState>("SELECT * FROM AppState WHERE Name = ?", name);
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










        //ROAMING STATE
        public void AddRoamingState(string name, string value)
        {
            Windows.Storage.ApplicationDataContainer roamingSettings = Windows.Storage.ApplicationData.Current.RoamingSettings;
            roamingSettings.Values[name] = value;
        }

        public string RetrieveRoamingState(string name, string value)
        {

            Windows.Storage.ApplicationDataContainer roamingSettings = Windows.Storage.ApplicationData.Current.RoamingSettings;
            if (roamingSettings.Values.ContainsKey(name))
            {
                return roamingSettings.Values[name].ToString();
            }

            return string.Empty;
        }


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




}
