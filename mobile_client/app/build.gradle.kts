plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.privote.mobile"
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "com.privote.mobile"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        manifestPlaceholders["appAuthRedirectScheme"] = "com.privote.mobile"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    buildFeatures {
        viewBinding = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    sourceSets {
        getByName("main") {
            kotlin.directories.add("../../mopro-semaphore/MoproAndroidBindings")
            jniLibs.directories.add("../../mopro-semaphore/MoproAndroidBindings/jniLibs")
        }
    }

    androidResources {
        // The semaphore zkey is read by Mopro as a raw binary; keep it uncompressed
        // so we can stream-copy it from assets without aapt-induced inflation overhead.
        noCompress.add("zkey")
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    implementation(libs.recyclerview)
    implementation(libs.swiperefresh)

    // Auth
    implementation(libs.appauth)
    implementation(libs.security.crypto)

    // Network
    implementation(libs.retrofit)
    implementation(libs.retrofit.gson)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.gson)

    // Architecture
    implementation(libs.lifecycle.viewmodel)
    implementation(libs.lifecycle.livedata)

    // Mopro UniFFI bindings use JNA to load the generated Rust library.
    implementation("net.java.dev.jna:jna:${libs.versions.jna.get()}@aar")

    // Keccak-256 for hashing ciphertext into the Semaphore message field.
    implementation(libs.bouncycastle)

    // Lombok (annotation processing for Java)
    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    testCompileOnly(libs.lombok)
    testAnnotationProcessor(libs.lombok)

    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}
