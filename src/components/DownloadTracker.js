import React, { useState, useEffect } from 'react';
import { Download, Eye, TrendingUp, Calendar, Image, BarChart3 } from 'lucide-react';

const useDownloadTracker = () => {
  const [downloads, setDownloads] = useState([]);

  // Load downloads from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('photofy-downloads');
    if (stored) {
      setDownloads(JSON.parse(stored));
    }
  }, []);

  // Track a download
  const trackDownload = (photoData) => {
    const downloadRecord = {
      id: Date.now(),
      photoId: photoData.photoId,
      photoName: photoData.photoName,
      albumName: photoData.albumName,
      fileSize: photoData.fileSize || 'Unknown',
      format: photoData.format || 'jpg',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      downloadType: photoData.downloadType || 'standard', // 'standard', 'high-res', 'watermarked'
    };

    const updated = [...downloads, downloadRecord];
    setDownloads(updated);
    localStorage.setItem('photofy-downloads', JSON.stringify(updated));

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'file_download', {
        file_name: photoData.photoName,
        file_extension: photoData.format,
        album_name: photoData.albumName,
        download_type: photoData.downloadType
      });
    }

    // Optional: Send to your backend API
    // fetch('/api/track-download', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(downloadRecord)
    // });

    return downloadRecord;
  };

  // Get analytics
  const getAnalytics = () => {
    const totalDownloads = downloads.length;
    const uniquePhotos = new Set(downloads.map(d => d.photoId)).size;
    
    // Downloads by album
    const byAlbum = downloads.reduce((acc, d) => {
      acc[d.albumName] = (acc[d.albumName] || 0) + 1;
      return acc;
    }, {});

    // Downloads by date
    const byDate = downloads.reduce((acc, d) => {
      const date = new Date(d.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Most downloaded photos
    const photoDownloads = downloads.reduce((acc, d) => {
      const key = `${d.albumName}/${d.photoName}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topPhotos = Object.entries(photoDownloads)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      totalDownloads,
      uniquePhotos,
      byAlbum,
      byDate,
      topPhotos,
      recentDownloads: downloads.slice(-10).reverse()
    };
  };

  return { trackDownload, downloads, getAnalytics };
};

// ────────────────────────────────────────────────────────────────────────────
// 2. DOWNLOAD BUTTON COMPONENT
// ────────────────────────────────────────────────────────────────────────────

const DownloadButton = ({ 
  photoUrl, 
  photoName = 'photo.jpg',
  albumName = 'Gallery',
  photoId,
  fileSize,
  downloadType = 'standard',
  className = '',
  children
}) => {
  const { trackDownload } = useDownloadTracker();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      // Track the download
      trackDownload({
        photoId: photoId || photoUrl,
        photoName,
        albumName,
        fileSize,
        format: photoName.split('.').pop(),
        downloadType
      });

      // Method 1: Direct download (works for same-origin images)
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = photoName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Method 2: For cross-origin images (fallback)
      // This opens in new tab if Method 1 fails
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(photoUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`action-btn action-btn--primary ${className}`}
    >
      <Download size={18} className={downloading ? 'animate-bounce' : ''} />
      {children || (downloading ? 'Downloading...' : 'Download')}
    </button>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// 3. DOWNLOAD ANALYTICS DASHBOARD (Admin View)
// ────────────────────────────────────────────────────────────────────────────

const DownloadAnalyticsDashboard = () => {
  const { downloads, getAnalytics } = useDownloadTracker();
  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-neutral-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-2">Download Analytics</h1>
          <p className="text-neutral-400">Track photo downloads and engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <Download className="text-blue-500" size={24} />
              <span className="text-sm text-neutral-500">All Time</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{analytics.totalDownloads}</div>
            <div className="text-sm text-neutral-400">Total Downloads</div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <Image className="text-green-500" size={24} />
              <span className="text-sm text-neutral-500">Unique</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{analytics.uniquePhotos}</div>
            <div className="text-sm text-neutral-400">Photos Downloaded</div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-purple-500" size={24} />
              <span className="text-sm text-neutral-500">This Week</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {downloads.filter(d => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(d.timestamp) > weekAgo;
              }).length}
            </div>
            <div className="text-sm text-neutral-400">Recent Downloads</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          
          {/* Top Photos */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-blue-500" size={20} />
              <h2 className="text-xl font-light text-white">Most Downloaded</h2>
            </div>
            
            <div className="space-y-3">
              {analytics.topPhotos.slice(0, 5).map((photo, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-600 bg-opacity-20 flex items-center justify-center text-blue-500 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-white text-sm truncate max-w-[200px]">{photo.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(photo.count / analytics.topPhotos[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-neutral-400 text-sm w-8 text-right">{photo.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads by Album */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="flex items-center gap-2 mb-6">
              <Image className="text-green-500" size={20} />
              <h2 className="text-xl font-light text-white">By Album</h2>
            </div>
            
            <div className="space-y-3">
              {Object.entries(analytics.byAlbum)
                .sort(([, a], [, b]) => b - a)
                .map(([album, count], idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-white text-sm">{album}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-neutral-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(count / analytics.totalDownloads) * 100}%` }}
                        />
                      </div>
                      <span className="text-neutral-400 text-sm w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Downloads */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-purple-500" size={20} />
            <h2 className="text-xl font-light text-white">Recent Activity</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-neutral-700">
                  <th className="pb-3 text-sm font-medium text-neutral-400">Photo</th>
                  <th className="pb-3 text-sm font-medium text-neutral-400">Album</th>
                  <th className="pb-3 text-sm font-medium text-neutral-400">Type</th>
                  <th className="pb-3 text-sm font-medium text-neutral-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentDownloads.map((download) => (
                  <tr key={download.id} className="border-b border-neutral-700/50">
                    <td className="py-3 text-sm text-white">{download.photoName}</td>
                    <td className="py-3 text-sm text-neutral-400">{download.albumName}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-blue-600 bg-opacity-20 text-blue-400 text-xs rounded">
                        {download.downloadType}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-neutral-400">
                      {new Date(download.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Data */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              const dataStr = JSON.stringify(downloads, null, 2);
              const blob = new Blob([dataStr], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `download-analytics-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
          >
            Export Data
          </button>
        </div>

      </div>
    </div>
  );
};


export default DownloadButton;
export { useDownloadTracker, DownloadAnalyticsDashboard };