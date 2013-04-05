using ModernCSApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace ks
{
    public partial class MainPage
    {

        DispatcherTimer _dt;

        int iCurrentBatch = 0;

        List<IEnumerable<ksWebServices.srPortalPortalService.CompanyDTO1>> _batchs;

        private async Task<bool> _processBatchs()
        {
            if (_dt == null)
            {
                _dt = new DispatcherTimer();
                _dt.Interval = TimeSpan.FromMilliseconds(15);
                _dt.Tick += (o, e) =>
                {
                    _dt.Stop();

                    if (_batchs.Count() == iCurrentBatch)
                    {
                        Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
                        {

                            //List<GroupInfoList<object>> dataLetter = Store.GetGroupsByLetter();
                            //cvs2.Source = dataLetter;
                            //(semanticZoom.ZoomedOutView as ListViewBase).ItemsSource = cvs2.View.CollectionGroups;


                            progress.IsActive = false;

                        });


                        return;

                    }

                    _processBatch(_batchs[iCurrentBatch]);

                    iCurrentBatch++;

                };
                _dt.Start();
            }

            return true;
        }

        private async Task<bool> _processBatch(IEnumerable<ksWebServices.srPortalPortalService.CompanyDTO1> batch)
        {


            foreach (var item in batch)
            {
                _Store.Collection.Add(new Item()
                {
                    Title = item.Name,
                    Content = item.Email,
                    Subtitle = item.Shortname,
                    Category = item.ABN
                });
            }


            List<GroupInfoList<object>> dataLetter = _Store.GetGroupsByLetter();
            cvs2.Source = dataLetter;
            (semanticZoom.ZoomedOutView as ListViewBase).ItemsSource = cvs2.View.CollectionGroups;



            _dt.Start();

            return true;

        }

        public IEnumerable<IEnumerable<T>> Batch<T>(IEnumerable<T> collection, int batchSize)
        {
            List<T> nextbatch = new List<T>(batchSize);
            foreach (T item in collection)
            {
                nextbatch.Add(item);
                if (nextbatch.Count == batchSize)
                {
                    yield return nextbatch;
                    nextbatch = new List<T>(batchSize);
                }
            }
            if (nextbatch.Count > 0)
                yield return nextbatch;
        }

    }



}
