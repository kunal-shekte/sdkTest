package com.sdktest

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import airpush.AppsAirPushBundleLoader
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.defaults.DefaultComponentsRegistry
import com.facebook.react.defaults.DefaultReactHostDelegate
import com.facebook.react.defaults.DefaultTurboModuleManagerDelegate
import com.facebook.react.fabric.ComponentFactory
import com.facebook.react.runtime.ReactHostImpl

class MainApplication : Application(), ReactApplication {

  @OptIn(UnstableReactNativeAPI::class)
  override val reactHost: ReactHost by lazy {
    val packages = PackageList(this).packages.apply {
      // Keep packages that your app adds manually here.
    }
  
    val componentFactory = ComponentFactory()
    DefaultComponentsRegistry.register(componentFactory)
  
    val delegate = DefaultReactHostDelegate(
      jsMainModulePath = "index",
      jsBundleLoader = AppsAirPushBundleLoader.create(applicationContext),
      reactPackages = packages,
      turboModuleManagerDelegateBuilder = DefaultTurboModuleManagerDelegate.Builder(),
    )
  
    ReactHostImpl(
      applicationContext,
      delegate,
      componentFactory,
      true,
      BuildConfig.DEBUG,
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
