using ModernCSApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media;

namespace ks
{
   

    public class KeystoneStore
    {
        private ItemCollection _Collection = new ItemCollection();

        public ItemCollection Collection
        {
            get
            {
                return this._Collection;
            }
        }

        public KeystoneStore()
        {

        }

        internal List<GroupInfoList<object>> GetGroupsByLetter()
        {
            List<GroupInfoList<object>> groups = new List<GroupInfoList<object>>();

            var query = from item in Collection
                        orderby ((Item)item).Title
                        group item by ((Item)item).Title[0] into g
                        select new { GroupName = g.Key, Items = g };
            foreach (var g in query)
            {
                GroupInfoList<object> info = new GroupInfoList<object>();
                info.Key = g.GroupName;
                foreach (var item in g.Items)
                {
                    info.Add(item);
                }
                groups.Add(info);
            }

            return groups;

        }



    }

    public class Item : System.ComponentModel.INotifyPropertyChanged
    {
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }

        private string _Title = string.Empty;
        public string Title
        {
            get
            {
                return this._Title;
            }

            set
            {
                if (this._Title != value)
                {
                    this._Title = value;
                    this.OnPropertyChanged("Title");
                }
            }
        }

        private string _Subtitle = string.Empty;
        public string Subtitle
        {
            get
            {
                return this._Subtitle;
            }

            set
            {
                if (this._Subtitle != value)
                {
                    this._Subtitle = value;
                    this.OnPropertyChanged("Subtitle");
                }
            }
        }

        private ImageSource _Image = null;
        public ImageSource Image
        {
            get
            {
                return this._Image;
            }

            set
            {
                if (this._Image != value)
                {
                    this._Image = value;
                    this.OnPropertyChanged("Image");
                }
            }
        }

        //public void SetImage(Uri baseUri, String path)
        //{
        //    Image = new BitmapImage(new Uri(baseUri, path));
        //}

        private string _Link = string.Empty;
        public string Link
        {
            get
            {
                return this._Link;
            }

            set
            {
                if (this._Link != value)
                {
                    this._Link = value;
                    this.OnPropertyChanged("Link");
                }
            }
        }

        private string _Category = string.Empty;
        public string Category
        {
            get
            {
                return this._Category;
            }

            set
            {
                if (this._Category != value)
                {
                    this._Category = value;
                    this.OnPropertyChanged("Category");
                }
            }
        }

        private string _Description = string.Empty;
        public string Description
        {
            get
            {
                return this._Description;
            }

            set
            {
                if (this._Description != value)
                {
                    this._Description = value;
                    this.OnPropertyChanged("Description");
                }
            }
        }

        private string _Content = string.Empty;
        public string Content
        {
            get
            {
                return this._Content;
            }

            set
            {
                if (this._Content != value)
                {
                    this._Content = value;
                    this.OnPropertyChanged("Content");
                }
            }
        }
    }

    public class GroupInfoList<T> : List<object>
    {

        public object Key { get; set; }


        public new IEnumerator<object> GetEnumerator()
        {
            return (System.Collections.Generic.IEnumerator<object>)base.GetEnumerator();
        }
    }

    // Workaround: data binding works best with an enumeration of objects that does not implement IList
    public class ItemCollection : IEnumerable<Object>
    {
        private System.Collections.ObjectModel.ObservableCollection<Item> itemCollection = new System.Collections.ObjectModel.ObservableCollection<Item>();

        public IEnumerator<Object> GetEnumerator()
        {
            return itemCollection.GetEnumerator();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Add(Item item)
        {
            itemCollection.Add(item);
        }
    }


}
