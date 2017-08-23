package com.hpeit.mobile.login.dataStorage;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.util.Base64;
import android.util.Log;

/**
 * Shared Data Storage Implementation with SQLite database.
 * 
 * @author claude.villermain@hpe.com
 * 
 */
public class SQLiteDataStorage implements IDataStorage {
	private static final String LOG_TAG = "HPMobileLogin." + SQLiteDataStorage.class.getSimpleName();
//	private static final String PACKAGE_NAME = "com.hpeit.mobile.mobilitycat";
	private static final String PACKAGE_NAME = "com.hpeit.mobile.peoplefinder";
	private static final String DB_NAME = "hpmsso";
	private static final String DB_TABLE_NAME = "tokens";

	private SQLiteDatabase db;
	private LoginDataStorageStatus status;

	public SQLiteDataStorage(Context context) {
		init(context);
	}

	private void init(Context context) {
		Context hpmssoRefAppContext = null;
		
		String hpmssoRefApp = PACKAGE_NAME;
		try {
			// Check if a custom reference application is defined in the application manifest. This is the default application
			// to which the SQLite database is attached.
			// It can be defined in the application manifest as meta data in the <application> section, e.g.
			//    <meta-data android:name="hpmssoRefApp" android:value="com.hpit.mobile.l7mag22test" />
			ApplicationInfo ai = context.getPackageManager().getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA);
			String custom_hpmssoRefApp = ai.metaData.getString("hpmssoRefApp");
			if (custom_hpmssoRefApp != null && custom_hpmssoRefApp.length()>0) {
				hpmssoRefApp = custom_hpmssoRefApp;
				Log.d(LOG_TAG, "Using custom reference application to store shared session token: "+custom_hpmssoRefApp);
			}
		} catch (Exception e) {
			Log.w(LOG_TAG, "Unable to read application manifest: " + e.getMessage(), e);
		}
		
		try {
			// If app-catalog app is not installed, NameNotFoundException will be thrown when
			// calling context.createPackageContex() to create app-catalog context.
			hpmssoRefAppContext = context.createPackageContext(hpmssoRefApp, Context.CONTEXT_INCLUDE_CODE);
		} catch (NameNotFoundException e) {
			status = LoginDataStorageStatus.APP_CATALOG_NOT_INSTALLED;
			Log.w(LOG_TAG, "HPE Mobile SSO reference application (" + PACKAGE_NAME + ") isn't installed. " + e.getMessage(), e);
			return;
		}

		int appCatalogUID = hpmssoRefAppContext.getApplicationInfo().uid;
		int myUID = context.getApplicationInfo().uid;
		Log.d(LOG_TAG, "appCatalogUID=" + appCatalogUID + ", myUID=" + myUID);
		if (appCatalogUID == myUID) {
			status = LoginDataStorageStatus.OK;
			try {
				db=hpmssoRefAppContext.openOrCreateDatabase(DB_NAME, Context.MODE_PRIVATE, null);
				db.execSQL("CREATE TABLE IF NOT EXISTS "+DB_TABLE_NAME+"(key VARCHAR PRIMARY KEY, value VARCHAR)");
			} catch (SQLiteException e) {
				Log.e(LOG_TAG, "Error when opening or creating database table '"+DB_NAME+"/"+DB_TABLE_NAME+"': " + e.getMessage(), e);
			} 
		} else {
			Log.w(LOG_TAG, "The application isn't using the same shared user id than the HPE Mobile SSO reference application (" + PACKAGE_NAME + ")");
			status = LoginDataStorageStatus.NOT_SIGNED_BY_HPIT;
		}
	}

	public Boolean put(String key, String value) {
		Boolean result = false;
		byte[] data;
		try {
			data = value.getBytes("UTF-8");
			String base64value = Base64.encodeToString(data, Base64.DEFAULT); // Encode in Base64 to avoid code injection
			String query = "INSERT OR REPLACE INTO "+DB_TABLE_NAME+" VALUES ('"+key+"','"+base64value+"')";
			db.execSQL(query);
//			Log.d(LOG_TAG, query);
			result = true;
		} catch (Exception e) {
			Log.e(LOG_TAG, "Error when inserting row for key '"+key+"': " + e.getMessage(), e);
		}
		return result;
	}

	public String get(String key) {
		String value = null;
		String query = "SELECT value FROM "+DB_TABLE_NAME+" WHERE key='"+key+"'";
		try {
			Cursor cursor = db.rawQuery(query,  null);
//			Log.d(LOG_TAG, query);
			if (cursor.moveToFirst()) {
				String base64value = cursor.getString(0);
				byte [] data = Base64.decode(base64value, Base64.DEFAULT);
				value = new String(data, "UTF-8");
			}
		} catch (Exception e) {
			Log.e(LOG_TAG, "Error when reading row for key '"+key+"': " + e.getMessage(), e);
		}
		return value;
	}

	public LoginDataStorageStatus getStatus() {
		return this.status;
	}
}
